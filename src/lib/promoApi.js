/* promoApi.js — read scheduled promo campaigns from the backend (Wave 5).
   The backend owns the schedule (starts_at/ends_at/status); the storefront just
   shows what's live. SSR-safe: pure fetch, no window at import. */

import { get, isMedusaConfigured } from './medusa.js'

/* All campaigns running right now. [] if backend not wired / none active. */
export async function getActiveCampaigns() {
  if (!isMedusaConfigured()) return []
  try {
    const d = await get('/store/campaigns/active')
    return Array.isArray(d?.campaigns) ? d.campaigns : []
  } catch {
    return []
  }
}

/* The live campaign owning a promo-page slug, or null (used by /promo/:slug). */
export async function getCampaignForSlug(slug) {
  if (!isMedusaConfigured() || !slug) return null
  try {
    const d = await get('/store/campaigns/active', { slug })
    return d?.campaign || null
  } catch {
    return null
  }
}
