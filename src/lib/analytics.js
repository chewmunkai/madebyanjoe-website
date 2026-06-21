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

function ensureInjected() {
  if (injected || typeof window === 'undefined' || isEditingContext()) return
  if (!GA4_ID && !GTM_ID) return
  injected = true
  if (GTM_ID) injectGtm(GTM_ID)
  else injectGtag(GA4_ID)
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
}

/** Mount once near the top of <App/>. Injects the tag on first non-editor render and
 *  emits a page_view on every SPA navigation. Inert if no ID / in the editor. */
export function useAnalytics() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (isEditingContext()) return
    ensureInjected()
    trackPageview(pathname)
  }, [pathname])
}
