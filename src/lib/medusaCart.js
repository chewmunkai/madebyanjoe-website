/* medusaCart.js — cart operations against the Medusa v2 Store API.

   Responsibilities:
     - ensure a cart exists (create one scoped to the MYR region, persist its id)
     - add / update / remove line items
     - retrieve the cart with server-computed totals

   The cart id is kept in localStorage (key `anjoe-medusa-cart`) so a refresh
   reuses the same server cart. Line items are keyed by Medusa VARIANT id —
   that's what the SPA stores as `product.id` after catalog.js adapts it.

   Everything here is best-effort: if Medusa isn't configured, the helpers
   return null and the zustand store keeps running on local optimistic state. */

import { get, post, del, isMedusaConfigured } from './medusa.js'
import { getRegionId } from './catalog.js'

const CART_KEY = 'anjoe-medusa-cart'

/* ---- cart id persistence ---- */
function readCartId() {
  try {
    return localStorage.getItem(CART_KEY) || null
  } catch {
    return null
  }
}
function writeCartId(id) {
  try {
    if (id) localStorage.setItem(CART_KEY, id)
    else localStorage.removeItem(CART_KEY)
  } catch {
    /* storage unavailable (private mode) — fine, we just lose persistence */
  }
}

/* Create a fresh cart in the MYR region, persist its id, return the cart. */
async function createCart() {
  const region_id = await getRegionId()
  const data = await post('/store/carts', region_id ? { region_id } : {})
  const cart = data?.cart
  if (cart?.id) writeCartId(cart.id)
  return cart
}

/* Ensure we have a usable server cart. Tries the persisted id first; if that
   cart is gone (404 / already completed), starts a new one. Returns the cart
   object, or null when Medusa isn't configured. */
export async function ensureCart() {
  if (!isMedusaConfigured()) return null
  const id = readCartId()
  if (id) {
    try {
      const data = await get(`/store/carts/${id}`)
      if (data?.cart && !data.cart.completed_at) return data.cart
    } catch (err) {
      // stale/missing cart — fall through to create a fresh one
      if (err.status && err.status !== 404) {
        // a non-404 error (network etc.) is worth surfacing
        // but we still try to recover with a new cart
      }
    }
  }
  return createCart()
}

/* Add a line item by variant id. Returns the updated cart. */
export async function addLineItem(variantId, quantity = 1) {
  if (!isMedusaConfigured()) return null
  const cart = await ensureCart()
  if (!cart) return null
  const data = await post(`/store/carts/${cart.id}/line-items`, {
    variant_id: variantId,
    quantity,
  })
  return data?.cart || null
}

/* Set the quantity of an existing line item. qty <= 0 removes it. Returns the
   updated cart. The SPA tracks items by VARIANT id, so we look up the matching
   Medusa line-item id first. */
export async function setLineItemQty(variantId, quantity) {
  if (!isMedusaConfigured()) return null
  const cart = await ensureCart()
  if (!cart) return null

  const line = (cart.items || []).find((i) => i.variant_id === variantId)
  if (!line) {
    // nothing on the server yet — treat as an add when qty is positive
    if (quantity > 0) return addLineItem(variantId, quantity)
    return cart
  }

  if (quantity <= 0) {
    const data = await del(`/store/carts/${cart.id}/line-items/${line.id}`)
    // DELETE returns either { cart } or { parent: cart } depending on version
    return data?.cart || data?.parent || (await retrieveCart())
  }

  const data = await post(
    `/store/carts/${cart.id}/line-items/${line.id}`,
    { quantity }
  )
  return data?.cart || null
}

/* Remove a line item entirely by variant id. Returns the updated cart. */
export async function removeLineItem(variantId) {
  return setLineItemQty(variantId, 0)
}

/* Retrieve the current cart with totals, without forcing a create. */
export async function retrieveCart() {
  if (!isMedusaConfigured()) return null
  const id = readCartId()
  if (!id) return null
  try {
    const data = await get(`/store/carts/${id}`)
    return data?.cart || null
  } catch {
    return null
  }
}

/* Expose the persisted id + a way to clear it (used after a completed order). */
export function getCartId() {
  return readCartId()
}
export function clearCartId() {
  writeCartId(null)
}

/* Denormalize a Medusa line item → the SPA cart-item shape the UI reads:
     { id, name, price, img, slug, qty }
   `id` stays the variant id so it lines up with catalog.js + the cart store. */
export function lineItemToCartItem(line) {
  return {
    id: line.variant_id,
    name: line.product_title || line.title,
    // Medusa v2 prices are DECIMAL major units (RM) — do NOT divide by 100.
    price: line.unit_price ?? 0,
    img: line.thumbnail || '',
    slug: line.product_handle || '',
    qty: line.quantity,
  }
}
