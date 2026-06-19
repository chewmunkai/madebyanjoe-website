import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* Cart state. Persisted to localStorage so a refresh keeps the bag.
   Adding an item opens the drawer. */
export const useCart = create(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      add: (product, qty = 1) =>
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
        }),

      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      setQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: 'anjoe-cart', partialize: (s) => ({ items: s.items }) }
  )
)

export const selectCount = (s) => s.items.reduce((n, i) => n + i.qty, 0)
export const selectSubtotal = (s) =>
  s.items.reduce((n, i) => n + i.qty * i.price, 0)
