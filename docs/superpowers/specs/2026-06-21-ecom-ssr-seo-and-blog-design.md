# Ecom SSR/SEO + Templatized Blog — Design Spec

**Date:** 2026-06-21
**Status:** Approved in brainstorm (rendering = Vike; blog content = Medusa module; templatized blog + SEO subsystem). NOT built.
**Repos:** storefront `madebyanjoe-website` (Vite/React), backend `eps-talous-ecom-service` (Medusa v2).
**Context:** external gap review (GPT+Gemini) flagged the storefront's pure-CSR SPA as the top *technical* gap — it serves crawlers an empty root and can't carry our existing SEO investment. This spec settles the rendering model and adds a reusable, per-tenant blog + SEO subsystem.

---

## 1. Goal

Make the storefront **server-rendered for SEO** and give every store a **painless, templatized blog** — both as reusable subsystems that ride the existing manifest/studio/`import-design` pipeline and work per-tenant.

Success =
- Crawlers receive real HTML with correct meta, canonical, OG, and JSON-LD on every SEO surface.
- `sitemap.xml` + `robots.txt` exist and are accurate per-tenant.
- A client can publish a blog post in the Medusa admin in minutes: title → body → cover → pick a template → publish, with SEO auto-generated.
- The WebGL/animation experience is preserved.
- Lighthouse SEO ≈ 100 on content/commerce pages; Rich Results validates the JSON-LD.

## 2. Non-goals (explicit)

- Full headless CMS, comments, multi-author editorial workflow.
- AI content generation (that's a Talous/SEO-Autopilot concern, separate).
- On-demand SSR server / ISR runtime — we stay **SSG + static** on Cloudflare Pages (cheaper, simpler, fits the host).
- Auto-generated OG images (later upgrade).
- Structured block editor for blog bodies (v1 = rich-text; blocks are a later upgrade).
- Customer lifecycle/email, media library — out of scope (separate register items).

## 3. Rendering architecture — Vike (vite-plugin-ssr) on the existing Vite app

**Why Vike (not Astro/Next):** the storefront's pages are built by a visual **React/Puck** editor (the studio + manifest pipeline). Vike renders React natively, so it **pre-renders those exact Puck-composed pages to static HTML with no translation layer**. Astro would force a React-island bridge for every studio-built page for a marginal CWV gain; Next is the biggest rewrite and the worst Cloudflare-Pages fit. Vike closes the actual gap (crawlability) 100% while preserving the components, the studio, the manifest pipeline, and the animation library.

**Per-route render mode:**
| Surface | Mode | Reason |
|---|---|---|
| Product `/products/[slug]` | **prerender (SSG)** | money SEO; product JSON-LD |
| Collection / Shop `/shop`, `/collections/[slug]` | **prerender (SSG)** | category SEO |
| Blog index `/blog`, post `/blog/[slug]` | **prerender (SSG)** | the content SEO engine |
| About / FAQ / Shipping / Careers / Legal / landings | **prerender (SSG)** | static content SEO |
| Home (WebGL/three.js hero, GSAP, lenis) | **client-only island (`ssr: false`)** | browser-only libs; ranks on brand term regardless |
| Studio / Theme Editor | **client-only (`ssr: false`)** | admin tool, behind ticket auth, never needs SEO |

**Mechanics:**
- Adopt Vike's filesystem routing (`+Page.jsx`, `+config.js`, `+data.js`, `+Head`). Top-level `react-router-dom` is retired; any in-page routing stays inside client islands.
- Dynamic SSG routes (product, collection, blog post) get their URL list at build via Vike's prerender hook, fetched from Medusa.
- `+data` runs server-side (build time for prerendered pages) → fetches from Medusa → passes props to the page. The published Puck layout JSON for studio-built pages is fetched here, so **edit-in-studio → publish → SSG** still holds.
- Head/meta/JSON-LD emitted via a shared `<Seo>` component + `+Head`.
- Build output = static HTML/JS in `dist/client` → Cloudflare Pages static (no Functions required). `_redirects` SPA fallback stays for the client-only routes.

**SSR-safety workstream (required):** `gsap`, `lenis`, `three`, `@react-three/fiber/drei`, `Cursor`, `Magnetic`, `Preloader`, `SmoothScroll` are browser-only. They must run only on client islands or behind `useEffect`/no-SSR dynamic imports so the prerender build never touches `window`. This is the main migration risk and gets its own wave.

**Revalidation (SSG freshness):** product/price/stock and post publishes change static content. A Medusa subscriber fires a **Cloudflare Pages deploy hook** on publish (product updated, post published) → rebuild; plus a nightly scheduled rebuild as a backstop. Acceptable for low-traffic stores; revisit if a tenant needs near-real-time.

## 4. Blog content model — a Medusa `blog` module

New custom module `blog` (same pattern as `page-builder`, `customer-events`). Model `post`:

```
post {
  id, title, slug (unique per store), status (draft|published),
  excerpt, body_html (sanitized rich-text), cover_url,
  author_name, tags[] (or a join to a `post_tag`),
  template_key (standard|guide|listicle|product_story),
  related_product_ids[],
  seo { title, description, canonical, og_image },
  published_at, created_at, updated_at
}
```

- **Authoring** = a Medusa admin UI route (`src/admin/routes/blog/`) — list, create, edit, publish. Body via a WYSIWYG (TipTap/Lexical) → sanitized HTML. The client uses the **same admin they already use to run the store** → multi-tenant by construction, no git.
- **Store API:** `GET /store/blog` (paged, published only), `GET /store/blog/[slug]`. Consumed by the storefront `+data` at prerender time.
- **Migration:** one Mikro-ORM migration creating `post` (+ `post_tag` if tags are relational). Hand-written if `drizzle/medusa generate` risks a stale snapshot.

## 5. Templatized blog (the "painless" part)

A **fixed, small set of post templates**, each a React component that takes the post + renders a complete, SEO-correct article:

| Template | Use | Distinct layout |
|---|---|---|
| **Standard Article** | default posts | hero cover, title, body, author, related products |
| **Long-form Guide** | pillar/SEO content | table-of-contents, section anchors, longer measure |
| **Listicle** | "Top N …" | numbered item blocks, jump links |
| **Product Story** | brand/product narrative | inline product cards, shoppable CTAs |
| **Blog Index** | `/blog` | card grid, tag filter, pagination |

- Chosen per-post via `template_key` (a dropdown in the admin). Default = Standard Article.
- Each template **auto-emits SEO**: `<title>`/meta description/canonical/OG/Twitter, `BlogPosting` + `BreadcrumbList` JSON-LD, reading-time, author block, related-products strip.
- Templates are **manifest-described** (like page sections) so their knobs are editable in the studio and they ride `import-design` per tenant.
- Writing a post = title, body, cover, pick template, publish. Built once → **every tenant store inherits all templates.**

## 6. SEO subsystem (cross-cutting — serves blog *and* commerce)

A storefront `src/seo/` module + backend feed endpoints:
- **`<Seo>` component** — single source for title, meta description, canonical, OG/Twitter tags; per-page props with sensible per-tenant defaults.
- **JSON-LD helpers** — `Product`, `Organization`, `BreadcrumbList`, `BlogPosting`, `FAQPage`. Injected per route.
- **`sitemap.xml`** — generated at build from Medusa (products + collections + published posts + static pages). Per-tenant base URL.
- **`robots.txt`** — allow + sitemap pointer; block the studio/admin paths.
- **Canonical discipline** — one canonical per URL; trailing-slash + param normalization.
- All driven off the tenant's own Medusa data, so it's correct per-tenant with zero manual work.

## 7. Multi-tenant + reuse (stays on-rails)

- Blog module + templates + SEO subsystem are **generic**, not Anjoe-specific. A new tenant gets them by default through the existing provisioning (`/onboard-tenant`) and `import-design` flows.
- Per-tenant config (site name, base URL, default OG, social handles) comes from the tenant's Medusa store settings / env — already part of the tenant blueprint.
- No new infra per tenant: blog rows live in the tenant's existing Supabase DB; SSG runs in the tenant's existing CF Pages build.

## 8. Sequencing (waves — checkpoint after each)

- **Wave 0 — Prove the pipeline.** Add Vike; do the SSR-safety pass for the animation libs; prerender ONE simple route (FAQ/Legal) and ship it to CF Pages. Confirms Vike+CF Pages+SSG end-to-end on the real stack.
- **Wave 1 — SEO subsystem on the existing store.** `<Seo>` + JSON-LD helpers + `sitemap.xml` + `robots.txt`; prerender the existing content/commerce routes (About/FAQ/Legal/Shop/Product). **This alone fixes the crawlability gap for Anjoe today.**
- **Wave 2 — Blog MVP.** `blog` Medusa module + admin authoring + store API; Blog Index + Standard Article template; `BlogPosting` JSON-LD; sitemap includes posts.
- **Wave 3 — Full template set.** Guide / Listicle / Product Story + related-products + OG tags; manifest-describe the templates for studio editing.
- **Wave 4 — Productize.** Rebuild-on-publish (Medusa subscriber → CF Pages deploy hook) + nightly backstop; verify the whole thing rides `import-design` / per-tenant.

## 9. Risks & mitigations

- **SSR-safety regressions** (window/WebGL on server) → Wave 0 isolates this first; keep heavy libs in `ssr:false` islands.
- **Routing migration** (react-router → Vike) touches every page → do it incrementally route-by-route; keep a working build at each step.
- **SSG staleness** for dynamic product data → publish-triggered + nightly rebuilds; document the latency tradeoff.
- **Build time** grows with catalog/post count → fine at current scale; revisit incremental prerender if a tenant gets large.
- **Vike learning curve** for a 2-person team → Wave 0 is the learning slice; keep the surface small (filesystem routing + `+data` + `+Head`).
- **Admin WYSIWYG sanitisation** (stored HTML XSS) → sanitize on write (allowlist) and on render.

## 10. Verification

- View-source / curl a prerendered route → real content + correct `<title>`, meta, canonical, JSON-LD (not an empty root).
- Lighthouse SEO ≈ 100 on a content + a product page; Rich Results test passes for Product + BlogPosting.
- `sitemap.xml` lists products + collections + posts + pages; `robots.txt` points to it and blocks studio.
- WebGL home still renders + animates (client island).
- Studio publish → deploy hook → rebuilt static page reflects the change.
- A test post created in the Medusa admin appears at `/blog/[slug]` with its chosen template + auto-SEO.

## 11. Open decisions (resolved by lean — flag to change)

- **Blog body = rich-text (WYSIWYG → sanitized HTML)** for v1; structured blocks later. *(Tempered from the earlier "blocks" lean to keep v1 painless.)*
- **Revalidation = on-publish deploy hook + nightly rebuild** (not on-demand SSR).
- **Top-level routing = Vike filesystem routing**; react-router retired (kept only inside islands if needed).
- **OG images = static/uploaded** for v1; auto-generation later.
