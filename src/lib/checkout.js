/* checkout.js — real Medusa v2 checkout, PUBLIC API UNCHANGED.

   Exports (verbatim, so CartDrawer keeps working):
     - isCheckoutConfigured()        → boolean
     - startCheckout(items)          → completes the order, returns it
     - CheckoutNotConfiguredError    → thrown when no backend is wired

   Money paths are sacred: we never fake a charge. When Medusa isn't configured
   (no VITE_MEDUSA_URL / key), startCheckout throws CheckoutNotConfiguredError
   and the UI shows the honest "not live yet" state — exactly as before.

   The flow (Medusa Store API):
     1. ensure a cart exists with the items
     2. attach customer email + address
     3. list shipping options → set one
     4. create a payment collection → init a payment session
     5. complete the cart → order
     6. fire the Meta Pixel Purchase, deduped on order.id

   Payment provider defaults to `pp_system_default` (manual / COD). Clear seams
   are left for 'stripe' and 'paydibs' — when those return a `redirect_url`, we
   hand off to it instead of completing inline. */

import { get, post, del, isMedusaConfigured } from './medusa.js'
import { ensureCart, clearCartId, applyPromotions } from './medusaCart.js'
import { trackBeginCheckout, trackPurchase, getAttribution } from './analytics.js'

/* Default payment provider. Override per-call via startCheckout(items, opts).
   Known seams: 'pp_system_default' (manual), 'pp_stripe_stripe', 'pp_paydibs'. */
const DEFAULT_PROVIDER = 'pp_system_default'

export class CheckoutNotConfiguredError extends Error {
  constructor() {
    super('Checkout provider not configured')
    this.name = 'CheckoutNotConfiguredError'
  }
}

export function isCheckoutConfigured() {
  return isMedusaConfigured()
}

/* Main entry. `items` is the SPA cart array (id = variant id, qty, …).
   `opts` lets a future checkout form pass real customer details + provider:
     { email, shippingAddress, providerId, billingAddress } */
export async function startCheckout(items, opts = {}) {
  if (!items?.length) throw new Error('Cart is empty')
  if (!isMedusaConfigured()) throw new CheckoutNotConfiguredError()

  const providerId = opts.providerId || DEFAULT_PROVIDER

  // Fire begin_checkout (GA4 + Pixel). Analytics must never block the order.
  try {
    const value = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0)
    trackBeginCheckout({ value, items: items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty })) })
  } catch { /* ignore */ }

  // 1) Ensure a server cart, then make sure every SPA item is on it.
  let cart = await ensureCart()
  if (!cart) throw new Error('Could not create a checkout cart.')
  cart = await syncItemsOntoCart(cart, items)

  // 1b) Promo code (optional). Apply BEFORE completing so the order reflects the
  //     discount; an invalid code throws here so the shopper fixes it, never silently
  //     pays full price. Stacks with points redemption (added in the loyalty wave).
  if (opts.promoCode) {
    try {
      cart = (await applyPromotions(cart.id, opts.promoCode)) || cart
    } catch (e) {
      throw new Error(`Promo code "${opts.promoCode}" couldn't be applied — ${e.message}`)
    }
  }

  // 1c) Stamp first/last-touch attribution onto the cart (feeds affiliate + analytics).
  try {
    const attribution = getAttribution()
    if (attribution) await post(`/store/carts/${cart.id}/attribution`, { attribution })
  } catch { /* best-effort — never blocks the order */ }

  // 2) Customer email + address. These are required to complete a cart.
  //    Until a checkout form exists we use opts (or safe placeholders) — the
  //    seam is here, ready for real input.
  cart = await attachCustomer(cart, opts)

  // 3) Shipping: list options for this cart and select the first available.
  cart = await selectShipping(cart)

  // 4) Payment collection + session for the chosen provider.
  const session = await initPayment(cart, providerId)

  // 4a) External providers (Stripe / PayDibs) return a redirect URL — hand off.
  const redirectUrl = session?.data?.redirect_url
  if (redirectUrl) {
    window.location.href = redirectUrl
    return { redirected: true, redirectUrl }
  }

  // 5) Complete the cart → order (manual/COD path).
  const completed = await post(`/store/carts/${cart.id}/complete`)
  const order = completed?.order || completed?.cart || null
  if (!order || completed?.type === 'cart') {
    // Medusa returns { type: 'cart', cart, error } when completion failed.
    const reason = completed?.error?.message || 'Order could not be completed.'
    throw new Error(reason)
  }

  // 6) Order confirmed — clear the server cart id and fire the dedup'd pixel + GA4 purchase.
  clearCartId()
  firePurchasePixel(order)
  try {
    const value = order.total ?? order.summary?.current_order_total
    trackPurchase({ id: order.id, value, currency: (order.currency_code || 'myr').toUpperCase(), coupon: opts.promoCode })
  } catch { /* analytics must never break confirmation */ }

  return order
}

/* ---- step helpers ---- */

/* Make the server cart EXACTLY match the SPA cart before completing. We prune
   orphaned server lines (e.g. a removal whose background sync failed) and adjust
   every quantity up OR down — so the order can never include something the
   shopper didn't intend, and never charges the wrong quantity. */
async function syncItemsOntoCart(cart, items) {
  let current = cart
  const wanted = new Map(items.map((i) => [i.variantId || i.id, i.qty]))

  // 1) prune server lines no longer in the SPA cart
  for (const line of [...(current.items || [])]) {
    if (!wanted.has(line.variant_id)) {
      const data = await del(`/store/carts/${current.id}/line-items/${line.id}`)
      current = data?.cart || data?.parent || current
    }
  }

  // 2) add missing lines, and correct any quantity mismatch (up or down)
  for (const [variantId, want] of wanted) {
    const existing = (current.items || []).find((l) => l.variant_id === variantId)
    if (!existing) {
      const data = await post(`/store/carts/${current.id}/line-items`, {
        variant_id: variantId,
        quantity: want,
      })
      if (data?.cart) current = data.cart
    } else if (existing.quantity !== want) {
      const data = await post(
        `/store/carts/${current.id}/line-items/${existing.id}`,
        { quantity: want }
      )
      if (data?.cart) current = data.cart
    }
  }
  return current
}

/* Attach email + shipping/billing address. Real values come from `opts`;
   placeholders keep manual/COD test flows working until a form exists. */
async function attachCustomer(cart, opts) {
  const email = opts.email || cart.email || 'guest@madebyanjoe.com'
  const address =
    opts.shippingAddress || {
      first_name: 'Guest',
      last_name: 'Customer',
      address_1: '-',
      city: 'Kuala Lumpur',
      country_code: 'my',
      postal_code: '50000',
      phone: '',
    }
  const data = await post(`/store/carts/${cart.id}`, {
    email,
    shipping_address: address,
    billing_address: opts.billingAddress || address,
  })
  return data?.cart || cart
}

/* List shipping options for the cart and set the first one. */
async function selectShipping(cart) {
  const data = await get('/store/shipping-options', { cart_id: cart.id })
  const option = (data?.shipping_options || [])[0]
  if (!option) {
    throw new Error('No shipping options available for this destination.')
  }
  const res = await post(`/store/carts/${cart.id}/shipping-methods`, {
    option_id: option.id,
  })
  return res?.cart || cart
}

/* Create a payment collection for the cart, then initialize a session for the
   chosen provider. Returns the payment_session (which may carry redirect_url). */
async function initPayment(cart, providerId) {
  const pc = await post('/store/payment-collections', { cart_id: cart.id })
  const collection = pc?.payment_collection
  if (!collection?.id) {
    throw new Error('Could not create a payment collection.')
  }
  const session = await post(
    `/store/payment-collections/${collection.id}/sessions`,
    { provider_id: providerId }
  )
  return (
    session?.payment_session ||
    // some versions nest the active session on the collection
    session?.payment_collection?.payment_sessions?.find(
      (s) => s.provider_id === providerId
    ) ||
    null
  )
}

/* ---- Meta Pixel: Purchase, deduplicated on order.id ----
   We fire ONLY after the order is confirmed (never before complete) and use
   eventID = order.id so a CAPI server-side event with the same id dedupes,
   and a page refresh won't double-count. */
function firePurchasePixel(order) {
  try {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
    // Medusa v2 order totals are DECIMAL major units (RM) — do NOT divide by 100.
    const value = order.total ?? order.summary?.current_order_total
    const currency = (order.currency_code || 'myr').toUpperCase()
    window.fbq(
      'track',
      'Purchase',
      { value, currency, content_type: 'product' },
      { eventID: order.id }
    )
  } catch {
    /* pixel must never break the order confirmation */
  }
}
