import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isMedusaConfigured } from '../lib/medusa.js'
import {
  addLineItem,
  setLineItemQty,
  removeLineItem,
  retrieveCart,
  clearCartId,
  lineItemToCartItem,
} from '../lib/medusaCart.js'

/* Cart state — PUBLIC API UNCHANGED.
   State fields:  items, isOpen
   Actions:       open, close, add, remove, setQty, clear
   Selectors:     selectCount, selectSubtotal
   Persistence:   localStorage key `anjoe-cart` (items only)

   What changed under the hood: when a Medusa backend is configured, every
   mutation also syncs to the Store API. We keep OPTIMISTIC local state so the
   UI stays instant, then reconcile from the server cart in the background. If
   Medusa isn't configured (no URL/key) this behaves exactly like the original
   local-only cart — nothing breaks offline. */

const medusaOn = isMedusaConfigured()

/* Map the server cart's line items back into the SPA cart-item shape and merge
   it into local state. Called after each successful sync so totals/prices
   reflect the source of truth.

   We MERGE with the existing local items by id: server line items may omit
   product_handle / thumbnail / title, so we keep the slug/img/name we captured
   at add() time as a fallback — links and images never blank out on reconcile. */
function reconcile(set, cart) {
  if (!cart) return
  set((s) => {
    const prevById = new Map(s.items.map((i) => [i.id, i]))
    const items = (cart.items || []).map((line) => {
      const mapped = lineItemToCartItem(line)
      const prev = prevById.get(mapped.id)
      return {
        ...mapped,
        slug: mapped.slug || prev?.slug || '',
        img: mapped.img || prev?.img || '',
        name: mapped.name || prev?.name || '',
      }
    })
    return { items }
  })
}

/* Fire-and-forget sync wrapper: runs the Medusa op, reconciles on success,
   and swallows errors (the optimistic local state already updated the UI).
   We never block the UI on the network. */
function sync(set, op) {
  if (!medusaOn) return
  Promise.resolve()
    .then(op)
    .then((cart) => reconcile(set, cart))
    .catch(() => {
      /* keep optimistic local state; a later mutation or refresh re-syncs */
    })
}

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      add: (product, qty = 1) => {
        // --- optimistic local update (identical to the original behavior) ---
        set((s) => {
          const existing = s.items.find((i) => i.id === product.id)
          const items = existing
            ? s.items.map((i) =>
                i.id === product.id ? { ...i, qty: i.qty + qty } : i
              )
            : [
                ...s.items,
                {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  img: product.img,
                  slug: product.slug,
                  qty,
                },
              ]
          return { items, isOpen: true }
        })
        // --- background sync to Medusa (variantId falls back to id) ---
        sync(set, () => addLineItem(product.variantId || product.id, qty))
      },

      remove: (id) => {
        set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
        sync(set, () => removeLineItem(id))
      },

      setQty: (id, qty) => {
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        }))
        sync(set, () => setLineItemQty(id, qty))
      },

      clear: () => {
        set({ items: [] })
        // forget the server cart entirely so the next add starts fresh
        if (medusaOn) clearCartId()
      },

      /* Pull the server cart on boot so a persisted Medusa cart rehydrates its
         real line items + prices. No-op without a backend. Safe to call from a
         top-level effect. */
      hydrateFromServer: async () => {
        if (!medusaOn) return
        try {
          const cart = await retrieveCart()
          if (cart && (cart.items || []).length) reconcile(set, cart)
        } catch {
          /* ignore — keep whatever was persisted locally */
        }
        // reference get() so linters don't flag it as unused when extending
        void get
      },
    }),
    { name: 'anjoe-cart', partialize: (s) => ({ items: s.items }) }
  )
)

export const selectCount = (s) => s.items.reduce((n, i) => n + i.qty, 0)
export const selectSubtotal = (s) =>
  s.items.reduce((n, i) => n + i.qty * i.price, 0)
