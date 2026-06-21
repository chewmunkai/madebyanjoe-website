/* analytics.js — per-tenant GA4 / GTM injection so the storefront is discoverable by
   Talous's SEO + analytics brain (Talous reads GA4 outcomes + tracks the domain).

   IDs come from per-tenant BUILD env, set in each tenant's config:
     VITE_GTM_ID  (GTM-XXXXXXX)  — preferred; Talous delivers GA4 + Clarity via the container
     VITE_GA4_ID  (G-XXXXXXX)    — direct GA4 when no GTM container is used
   If GTM is set we inject ONLY GTM (it owns GA4/Clarity) to avoid double-counting.

   Safe by construction:
   - SSR-safe: no `window` access at import; everything runs inside an effect (client-only),
     so it survives the upcoming Vike prerender untouched.
   - Never tracks the in-admin editor (?embed=1 / /studio) — that's the operator editing,
     not a shopper, and must not pollute the tenant's analytics.
   - No-op when neither ID is set (the mechanism ships inert until a tenant provides an ID). */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GA4_ID = import.meta.env.VITE_GA4_ID || ''
const GTM_ID = import.meta.env.VITE_GTM_ID || ''
const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID || ''
const ATTR_KEY = 'anjoe-attribution'

let injected = false

function isEditingContext() {
  try {
    const embed = new URLSearchParams(window.location.search).get('embed') === '1'
    return embed || (window.location.pathname || '').startsWith('/studio')
  } catch {
    return false
  }
}

function injectGtm(id) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`
  document.head.appendChild(s)
}

function injectGtag(id) {
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(s)
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  // SPA: we emit page_view manually on navigation, so disable the automatic first hit.
  window.gtag('config', id, { send_page_view: false })
}

/* Meta Pixel base code — checkout.js already fires the deduped Purchase; this bootstraps
   window.fbq so that (and the ecommerce events below) actually send. */
function injectFbPixel(id) {
  if (window.fbq) return
  const n = (window.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
  })
  if (!window._fbq) window._fbq = n
  n.push = n; n.loaded = true; n.version = '2.0'; n.queue = []
  const t = document.createElement('script')
  t.async = true
  t.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(t)
  window.fbq('init', id)
  window.fbq('track', 'PageView')
}

function ensureInjected() {
  if (injected || typeof window === 'undefined' || isEditingContext()) return
  if (!GA4_ID && !GTM_ID && !FB_PIXEL_ID) return
  injected = true
  if (GTM_ID) injectGtm(GTM_ID)
  else if (GA4_ID) injectGtag(GA4_ID)
  if (FB_PIXEL_ID) injectFbPixel(FB_PIXEL_ID)
}

function trackPageview(path) {
  if (typeof window === 'undefined') return
  const payload = { page_path: path, page_location: window.location.href, page_title: document.title }
  if (GTM_ID) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'page_view', ...payload })
  } else if (GA4_ID && window.gtag) {
    window.gtag('event', 'page_view', payload)
  }
  if (FB_PIXEL_ID && window.fbq) window.fbq('track', 'PageView')
}

/* ── Ecommerce events — fired to GA4 (gtag or GTM dataLayer) AND Meta Pixel ──
   Purchase fires its FB side in checkout.js (deduped via eventID), so trackPurchase is
   GA4-only here to avoid double-counting the pixel. */
function gaEvent(name, params) {
  if (typeof window === 'undefined') return
  if (GTM_ID) { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: name, ...params }) }
  else if (GA4_ID && window.gtag) window.gtag('event', name, params)
}
function fbEvent(name, params) {
  if (typeof window !== 'undefined' && FB_PIXEL_ID && window.fbq) window.fbq('track', name, params)
}

export function trackViewItem(item) {
  const currency = item.currency || 'MYR'
  gaEvent('view_item', { currency, value: item.price, items: [{ item_id: item.id, item_name: item.name, price: item.price }] })
  fbEvent('ViewContent', { content_ids: [item.id], content_name: item.name, value: item.price, currency })
}
export function trackAddToCart(item) {
  const currency = item.currency || 'MYR'
  const value = (item.price || 0) * (item.qty || 1)
  gaEvent('add_to_cart', { currency, value, items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: item.qty || 1 }] })
  fbEvent('AddToCart', { content_ids: [item.id], content_name: item.name, value, currency })
}
export function trackBeginCheckout({ value, currency = 'MYR', items = [] }) {
  gaEvent('begin_checkout', { currency, value, items })
  fbEvent('InitiateCheckout', { value, currency, num_items: items.length })
}
export function trackPurchase({ id, value, currency = 'MYR', items = [], coupon }) {
  gaEvent('purchase', { transaction_id: id, currency, value, coupon, items })
}

/* ── First/last-touch attribution (UTM + ref + click ids) ──
   Persisted so the affiliate + analytics layers read it; sent to the cart at checkout.
   first_touch is sticky; last_touch updates on each newly-tagged visit. */
function captureAttribution() {
  if (typeof window === 'undefined') return
  try {
    const p = new URLSearchParams(window.location.search)
    const fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'gclid', 'fbclid']
    const touch = {}
    for (const f of fields) { const v = p.get(f); if (v) touch[f] = v }
    if (!Object.keys(touch).length) return
    touch.ts = Date.now()
    touch.landing = window.location.pathname
    const cur = JSON.parse(localStorage.getItem(ATTR_KEY) || '{}')
    localStorage.setItem(ATTR_KEY, JSON.stringify({ first_touch: cur.first_touch || touch, last_touch: touch }))
  } catch { /* ignore */ }
}
export function getAttribution() {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(ATTR_KEY) || 'null') } catch { return null }
}

/** Mount once near the top of <App/>. Injects the tag(s) on first non-editor render,
 *  captures attribution, and emits a page_view on every SPA navigation. */
export function useAnalytics() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (isEditingContext()) return
    captureAttribution()
    ensureInjected()
    trackPageview(pathname)
  }, [pathname])
}
