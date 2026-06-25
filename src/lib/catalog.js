/* catalog.js — turns Medusa's Store API products into the SPA's product shape.

   The rest of the app (Shop, Product, ProductCard, Home) only knows the shape
   defined in src/data/products.js:
     { id, slug, name, price (number, RM), img, size, type, group,
       eyebrow, blurb, notes, featured, flagship }
   plus a `variantId` we tack on so the cart can talk to Medusa.

   This module:
     1. Resolves the MYR region once (cached).
     2. Lists products with calculated MYR prices for that region.
     3. Adapts each Medusa product → the SPA shape above.

   Money note: Medusa v2 returns prices in the SMALLEST currency unit (sen).
   MYR has 100 sen, so we divide by 100 for the RM number the UI displays.

   Everything is async. If Medusa isn't configured (no URL/key) the helpers
   resolve to null so callers can fall back to the static products.js catalog. */

import { get, isMedusaConfigured } from './medusa.js'

const CURRENCY_CODE = 'myr'

/* ---- module caches (resolve network work once per page load) ---- */
let regionPromise = null
let catalogPromise = null

/* Resolve the MYR region id. Cached: the first caller triggers the fetch,
   everyone else awaits the same promise. */
export async function getRegionId() {
  if (!isMedusaConfigured()) return null
  if (!regionPromise) {
    regionPromise = get('/store/regions')
      .then((data) => {
        const regions = data?.regions || []
        const myr = regions.find(
          (r) => (r.currency_code || '').toLowerCase() === CURRENCY_CODE
        )
        if (!myr) {
          throw new Error(
            'No MYR region found in Medusa — products cannot be priced in RM.'
          )
        }
        return myr.id
      })
      .catch((err) => {
        // Reset so a later call can retry instead of caching the failure.
        regionPromise = null
        throw err
      })
  }
  return regionPromise
}

/* ---- field mapping helpers ---- */

/* Pull the calculated price (in RM) off a variant. Medusa v2 stores prices as
   DECIMAL MAJOR units (218 = RM218), NOT minor units — so we do NOT divide by
   100. (calculated_amount is the region-scoped price; `amount` is the fallback.) */
function variantPriceRM(variant) {
  const cp = variant?.calculated_price
  const amount =
    cp?.calculated_amount ??
    cp?.amount ??
    variant?.price?.amount ??
    null
  if (amount == null) return null
  return amount
}

/* Best image URL for a product. */
function productImage(p) {
  return p?.thumbnail || p?.images?.[0]?.url || ''
}

/* Map a Medusa product into the SPA `group` enum (skincare | sets | tools).
   Source of truth, in priority order: collection handle → a matching tag →
   product type → metadata. Falls back to 'skincare' so it always renders. */
function productGroup(p) {
  const allowed = ['skincare', 'sets', 'tools']
  const collection = (p?.collection?.handle || '').toLowerCase()
  if (allowed.includes(collection)) return collection

  const tag = (p?.tags || [])
    .map((t) => (t.value || '').toLowerCase())
    .find((v) => allowed.includes(v))
  if (tag) return tag

  const typeVal = (p?.type?.value || '').toLowerCase()
  if (allowed.includes(typeVal)) return typeVal

  const meta = (p?.metadata?.group || '').toLowerCase()
  if (allowed.includes(meta)) return meta

  return 'skincare'
}

/* The display "type" line (Cleanser, Bundle, Tool…). */
function productType(p) {
  return p?.type?.value || p?.metadata?.type || ''
}

/* Size string. Medusa has no first-class size, so derive it from variant
   options / sku / metadata when present. */
function productSize(p, variant) {
  if (p?.metadata?.size) return String(p.metadata.size)
  const opt = variant?.options?.find((o) =>
    /size|volume|ml|pcs/i.test(o?.option?.title || o?.value || '')
  )
  if (opt?.value) return String(opt.value)
  return ''
}

/* Adapt one Medusa product → SPA product shape. We pick the first variant as
   the purchasable unit (this storefront is single-variant per product). */
export function adaptProduct(p) {
  const variant = p?.variants?.[0] || null
  const price = variantPriceRM(variant)

  return {
    // id is the variant id — that's the unit the cart line-item needs, and the
    // SPA already treats id as the cart key. Falls back to product id.
    id: variant?.id || p.id,
    variantId: variant?.id || null, // explicit seam for medusaCart.js
    productId: p.id,
    slug: p.handle, // Medusa's URL-safe identifier maps to SPA slug
    name: p.title,
    price: price ?? 0,
    img: productImage(p),
    // Full gallery from the admin (thumbnail first, then the rest, deduped). The PDP
    // uses this when present so admin uploads drive the gallery; falls back to the
    // static galleries.js only for products with no admin images.
    images: [...new Set([p?.thumbnail, ...((p?.images || []).map((i) => i.url))].filter(Boolean))],
    size: productSize(p, variant),
    type: productType(p),
    group: productGroup(p),
    eyebrow: p?.subtitle || p?.metadata?.eyebrow || '',
    blurb: p?.description || '',
    notes: Array.isArray(p?.metadata?.notes)
      ? p.metadata.notes
      : typeof p?.metadata?.notes === 'string'
      ? p.metadata.notes.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
    featured: Boolean(p?.metadata?.featured),
    flagship: Boolean(p?.metadata?.flagship),
  }
}

/* Fetch + adapt the whole catalog (cached). Returns an array of SPA products,
   or null when Medusa isn't configured (caller falls back to products.js). */
export async function fetchCatalog() {
  if (!isMedusaConfigured()) return null
  if (!catalogPromise) {
    catalogPromise = (async () => {
      const regionId = await getRegionId()
      const data = await get('/store/products', {
        // region_id sets the pricing context; passing currency_code TOO is
        // rejected by Medusa v2 ("Unrecognized fields: 'currency_code'").
        region_id: regionId,
        limit: 100,
        // embed the bits we map from. `+metadata` ADDS metadata to the default
        // fields (a bare `metadata` would drop title/handle); group/featured/size/
        // notes/type/flagship all live in product.metadata (see enrich-anjoe-display).
        fields:
          '*variants.calculated_price,*images,*collection,*tags,*type,*variants.options,+metadata',
      })
      const adapted = (data?.products || []).map(adaptProduct)
      // Surface mispriced products early: price 0 means the variant has no MYR
      // calculated_price — the UI would show RM0 and checkout would later reject.
      const mispriced = adapted.filter((a) => !a.price).map((a) => a.slug)
      if (mispriced.length) {
        console.warn(
          `[catalog] ${mispriced.length} product(s) have no MYR price (RM0): ${mispriced.join(', ')}. ` +
            `Add a MYR price to their variant in Medusa.`
        )
      }
      return adapted
    })().catch((err) => {
      catalogPromise = null
      throw err
    })
  }
  return catalogPromise
}

/* ---- convenience selectors mirroring products.js, but async ---- */

export async function getProductAsync(slug) {
  const list = await fetchCatalog()
  if (!list) return null
  return list.find((p) => p.slug === slug) || null
}

// List helpers return [] (never null) so callers can safely .map/.length even
// when Medusa is unconfigured. (getProductAsync stays null = "not found".)
export async function getFeaturedAsync() {
  const list = await fetchCatalog()
  if (!list) return []
  return list.filter((p) => p.featured)
}

export async function getRelatedAsync(slug, n = 3) {
  const list = await fetchCatalog()
  if (!list) return []
  const current = list.find((p) => p.slug === slug)
  const group = current?.group || 'skincare'
  return list.filter((p) => p.slug !== slug && p.group === group).slice(0, n)
}

/* Clear caches — handy for tests or a manual refresh. */
export function resetCatalogCache() {
  regionPromise = null
  catalogPromise = null
}
