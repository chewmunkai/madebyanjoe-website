import { create } from 'zustand'
import { products as fallbackProducts } from '../data/products.js'
import { fetchCatalog } from '../lib/catalog.js'

/* Live catalog from Medusa, seeded with the static products.js as instant fallback.
   Components select `products` so they re-render when the live data arrives. The
   live products carry `variantId` (needed by the Medusa cart) and reflect anything
   edited in the Medusa admin. If the backend is unreachable, the static catalog
   stays — nothing breaks. Helpers mirror products.js (getProduct/getRelated/getFeatured). */
export const useCatalog = create((set, get) => ({
  products: fallbackProducts,
  loaded: false,
  hydrate: async () => {
    if (get().loaded) return
    try {
      const live = await fetchCatalog()
      if (live && live.length) set({ products: live, loaded: true })
    } catch {
      /* keep the static fallback */
    }
  },
  getProduct: (slug) => get().products.find((p) => p.slug === slug),
  getFeatured: () => get().products.filter((p) => p.featured),
  getRelated: (slug, n = 3) => {
    const ps = get().products
    const group = ps.find((p) => p.slug === slug)?.group || 'skincare'
    return ps.filter((p) => p.slug !== slug && p.group === group).slice(0, n)
  },
}))

// Kick off hydration once at module load; subscribers re-render when it lands.
useCatalog.getState().hydrate()
