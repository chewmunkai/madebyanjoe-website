# Tenant ↔ Talous SEO Discoverability — Design Spec

**Date:** 2026-06-21
**Status:** Design approved in brainstorm (scope = full). NOT built.
**Systems:** storefront `madebyanjoe-website` · ecom backend `eps-talous-ecom-service` (Medusa) ·
control plane `eps-store-control` · **Talous** (`ai-tasks`, the SEO brain).

## 1. Goal

Make **every tenant store — Anjoe now + all future tenants — discoverable and measured by
Talous's SEO system**, automatically, as part of the tenant lifecycle.

"Discoverable by Talous" = (a) the store emits analytics Talous can read, (b) Talous has the
store registered as an SEO subject (domain + GA4 + keywords), (c) once crawlable, its sitemap
is known to Search Console + Talous.

## 2. Scope decision (operator, 2026-06-21)

**Full scope** — tracking **and** autopilot, cost not a concern. **But the autopilot
*activation* (the LLM judge spend) is the operator's separate session.** So this spec builds the
**discoverability foundation + the contract**, and the SEO Autopilot judge stays a **per-tenant
flip** the operator throws later (`ENABLE_SEO` is currently `0` in Talous prod). We wire
everything *up to* activation; we do not turn on recurring LLM spend here.

## 3. Grounding (verified state)

- **Talous = `ai-tasks`** locally. Its SEO Autopilot (keyword tracking + GA4 outcomes + the
  `/seo/connect` tag delivery) exists but is **OFF in prod** and its connect/judge code is
  **spread across branches/worktrees** (`talous-wt-seo-ovs`, `talous-w2`) — NOT clean on the main
  checkout. → The canonical Talous SEO branch must be identified before any Talous-side code (Phase 2).
- **Anjoe already exists in Talous as a brand** (its ads run there). So Anjoe is a *link to an
  existing brand*, not a new record.
- **The storefront emits zero analytics today.** Talous literally can't see it yet. We own the
  storefront code → native injection is clean (better than Talous's WordPress-plugin / Webflow-paste paths).

## 4. The contract — a per-tenant "SEO identity"

Every tenant carries an SEO identity, sourced from tenant config:

```
seoIdentity = {
  domain,            // the public storefront URL (rank tracking + canonical)
  ga4_property,      // GA4 measurement ID (G-XXXX) — outcomes/traffic
  gtm_id,            // optional GTM container (GTM-XXXX) if Talous delivers via GTM
  talous_brand_id,   // the Talous brand this store links to (Anjoe = existing)
  gsc_property,      // Search Console property (set once SSR ships)
}
```

Lives in: the **control-plane registry** (`eps-store-control`, references only) + the tenant's
**Medusa store settings** (so the storefront can read it at build/runtime) + the
`tenant.env` contract. One identity, three consumers.

## 5. The three wires

**Wire 1 — Native analytics injection (store → Talous's data).** The storefront auto-loads the
tenant's GA4 (and GTM if used) from config (`VITE_GA4_ID` / store-settings). SSR-safe: the
analytics snippet is a client-only concern (loads after hydration; never runs during the Vike
prerender). Automatic for every tenant — no plugin, no manual paste. *This is what makes a store
visible to Talous.*

**Wire 2 — Talous site registration (Talous knows the tenant).** The tenant is linked to a Talous
brand-site with its domain + GA4 + a keyword seed, so it appears in Talous SEO and keyword
tracking runs. Anjoe = link to the existing brand. **Mechanism (API vs `/seo/connect` UI vs a DB
row) = TBD against the canonical Talous SEO branch → Phase 2.**

**Wire 3 — Sitemap → Search Console.** Rides Vike Wave 1 (the SSR spec): once the tenant has a
real `sitemap.xml`, it's submitted to GSC; GSC + Talous track indexation. Pure dependency on the
SSR build; nothing new here beyond wiring the identity's `gsc_property`.

## 6. Onboarding automation (future tenants born discoverable)

`/onboard-tenant` gains steps: provision/confirm the GA4 property + Talous brand link → write the
`seoIdentity` into the registry + Medusa store settings → the storefront build picks up the tags →
(Phase 2) register the site in Talous → submit the sitemap. The runbook documents it now; the
automation hardens when tenant #2 actually onboards (no over-building ahead of demand).

## 7. Phasing

**Phase 1 — Discoverability foundation (build now; store-side; we own it, no Talous archaeology):**
1. `seoIdentity` in the control-plane registry shape + `tenant.env` contract + Medusa store-settings field.
2. Native GA4/GTM injection in the storefront (generic; reads config; SSR-safe).
3. `/onboard-tenant` runbook updated with the SEO-identity steps.
4. Anjoe: set its `seoIdentity` (operator supplies Anjoe's GA4/GTM IDs) and ship the tags.

**Phase 2 — Talous-side (operator's separate session; needs the canonical Talous SEO branch):**
5. Identify the canonical Talous SEO branch; map its site-registration mechanism.
6. Register each tenant as a Talous brand-site (API or `/seo/connect`); seed keywords.
7. Submit sitemaps (after SSR Wave 1).
8. Flip the SEO Autopilot judge per tenant (`ENABLE_SEO`) — the LLM spend the operator owns.

## 8. Open unknowns (resolve before the dependent step)

- **Canonical Talous SEO branch** — which of the scattered SEO branches is the source of truth? (blocks Phase 2)
- **Anjoe's GA4 / GTM IDs** — operator-supplied; needed for Wire 1 on Anjoe.
- **Talous registration surface** — programmatic API vs `/seo/connect` UI vs direct DB row.
- **GTM vs direct GA4** — does Talous require its own GTM container per site, or is a GA4 ID enough?

## 9. Verification

- Storefront page-views appear in the tenant's GA4 (real-time) → Talous's GA4-outcomes feed sees them.
- The tenant appears as an SEO subject in Talous (Phase 2).
- `sitemap.xml` submitted + indexation visible in GSC (after SSR).
- Onboarding a test tenant yields a store that's emitting analytics with zero manual tag work.

## 10. Non-goals

- Building/altering Talous's SEO judge logic.
- Turning on the recurring LLM spend (the operator activates per tenant, separately).
- Anjoe's analytics account setup (operator owns the GA4/GTM accounts; we consume the IDs).
