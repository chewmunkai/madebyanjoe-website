# No-Code Store Builder — Design Spec

**Date:** 2026-06-21
**Status:** Design approved (scope + slicing). Building slice 1.
**Repos:** `madebyanjoe-website` (storefront + Puck editor), `eps-talous-ecom-service` (Medusa backend + persistence).

## Goal
Let the Anjoe store owner change their storefront themselves — content, products, images/video,
layout/composition, and animation — through a visual editor, **without a developer**. Built as a
*curated brand-block builder* (not a from-scratch Webflow): clients **compose, fill, upload, pick
variants, and tune motion presets**; they do not author arbitrary layouts or keyframe motion.

## Scope decision
**Anjoe-first, clean boundaries to generalize later.** Single store now; the data model leaves a
`tenant_id` seam so this can become the multi-client EPS product without a rewrite.

## Non-goals (the honest boundary)
- No generic motion authoring (no timeline / keyframe UI). Animation = curated presets + knobs.
- No arbitrary layout design. Sections keep their bespoke designs; choice is via *variants*.
- No multi-tenant infra yet (one store), but the schema is keyed so tenancy is additive.
- This is the same line Shopify draws: sections + developer-exposed settings + blocks.

## Engine & architecture
- **Editor:** extend Puck (already integrated, MIT, self-hosted, React).
- **Persistence:** a Medusa `page_builder` module. Table `page_layout`: `slug` (unique), `draft`
  (jsonb), `published` (jsonb), timestamps. `tenant_id` seam reserved.
- **Store API (public):** `GET /store/page-layouts/:slug` → `published` only.
- **Admin API (admin-auth):** `GET /admin/page-layouts/:slug` (draft, falls back to published),
  `PUT /admin/page-layouts/:slug` (save draft), `POST /admin/page-layouts/:slug/publish`
  (copy draft → published).
- **Auth:** `/studio` is gated behind a Medusa **admin** login (email/password → bearer token via
  `/auth/user/emailpass`); the token authorizes all admin calls. Anonymous users can't open it.
- **Rendering:** live pages render the **published** layout through a `PageRenderer` using the same
  section components as today — no editor wrappers → design stays pixel-perfect. If the backend has
  no published layout yet, the renderer falls back to the in-code default, so nothing breaks pre-publish.

## The block model
Each section is a Puck block exposing up to four things:
1. **Content fields** (text, links, product picks)
2. **Variant selector** (e.g. hero: `webgl | image | video`)
3. **Animation preset** (`{ preset, speed, intensity }`)
4. **Nested item slots** (carousel cards, reviews, reels)

The editor only ever emits a JSON layout; the default layout equals the current composition, so the
site is visually unchanged until something is edited and **published**.

## Slices (each ships + is verified against the LIVE store before the next starts)

### Slice 1 — Real foundation  ← building now
`page_builder` module + migration; public store read + admin-gated draft/publish routes; `/studio`
behind admin login; draft→publish flow; Home renders the **published** layout from the backend
(replacing localStorage). Section reorder/add/remove becomes genuinely persisted.
**Acceptance:** on prod admin, reorder/edit → Publish → live homepage reflects it; an anonymous user
cannot open `/studio`; the public store API returns only the published layout.

### Slice 2 — Content + media
Content fields on all 8 sections (text, links, product picks) + a Medusa **upload field** (file
module) so the client swaps the hero image/video and section images with their own uploads.
**Acceptance:** client edits the hero headline + uploads a new hero image on prod → publishes → live reflects.

### Slice 3 — Animation presets + hero variants
Refactor each section's motion to accept `{ preset, speed, intensity }`; hero gets variants
(`webgl | image | video`) + intensity. Clients pick/tune motion; they don't author it.
**Acceptance:** client switches hero to a static image + sets a section reveal to "fade / slow" → live
reflects; the WebGL-off path is verified (clean mount/unmount).

### Slice 4 — Nested lists + more pages
Nested drop-zones for carousel products / reviews / reels (add/remove/reorder individual items);
extend `PageRenderer` to Shop + About.
**Acceptance:** client adds/removes a review and a product card, edits About copy; all persist + publish.

## Multi-tenant seams (for later productization)
- Layouts keyed by `slug` now; add `tenant_id` later (composite key) — additive migration.
- Theme already uses CSS variables at `:root` → a future global "theme settings" block.
- The component registry is data-driven → reusable across tenants unchanged.

## Verification discipline (hard rule)
Every slice is verified against the **production build** (not `npm run dev`) and the live
`medusa.edgepoint.work` / `anjoe.edgepoint.work` before it's called done. Dev-mode verification
missed real prod bugs earlier this session — it does not count.

## Deploy notes / known gotchas
- Medusa Dockerfile `CMD` must stay `npm run start` only — baking `db:migrate` into it **hangs** in
  prod (redis/workflow handles keep the migrate process alive). Run migrations as a separate
  `docker exec … medusa db:migrate` step after the image is up.
- After any DB migration, verify the container **boots** (logs + health + a 200) — don't trust CI green.
- `STORE_CORS` must include the storefront origin for the public layout fetch; admin calls rely on `ADMIN_CORS`.

## Risks
- Puck nested zones complexity (slice 4).
- WebGL hero variant toggling (slice 3) — ensure clean mount/unmount, no leaked GL context.
- Admin-auth + CORS for the `/studio` fetch/upload path.
- Migration/boot discipline on Medusa (see deploy notes).
