# Design Manifest Pipeline + Studio-in-Admin — Design

- **Date:** 2026-06-21
- **Status:** approved (design), pending implementation plan
- **Author:** Claude + Sheng
- **Repos:** `madebyanjoe-website` (`feat/medusa-integration`) — storefront/editor; `eps-talous-ecom-service` (`backend/apps/backend`) — Medusa admin.
- **Builds on:** `2026-06-21-no-code-builder-design.md` (the existing Puck `/studio` + `page_builder` module). System note: `40 Systems/EPS Ecom Service (Store Builder)` (Obsidian).

## 1. Problem & goal

The no-code builder works, but every editable page was **hand-prop-driven and hand-configured** in Puck. That doesn't scale to "port a design in and have it instantly editable." And `/studio` lives in the storefront with a localStorage admin JWT — outside the backend, weaker auth.

Two goals:

1. **Design Manifest Pipeline (Feature B)** — every design self-describes its editable surface in a **manifest file**. The editor compiles the manifest into the full control panel automatically. Porting a design = drop its manifest + components in; the editor orients itself. No hand-written Puck config per design.
2. **Studio-in-Admin (Feature A)** — move the editor **into the Medusa admin** (Shopify-style: open from admin, canvas = storefront in an iframe, native admin auth via SSO token). Deletes the standalone `/studio` login + localStorage JWT.

**Design source decision (locked):** *we control the designs.* Designs are authored to a build guideline that emits a conformant manifest. This makes auto-generated controls **deterministic** — no parsing arbitrary code at port time.

## 2. Non-goals / honest boundaries

- **Not** a magic parser that extracts animations from arbitrary third-party repos. Automation is *given the build guideline*; a design that ignores the guideline gets no free bars.
- **Not** a from-scratch Webflow/Framer runtime visual editor.
- **Not** ripping out Anjoe's working configs in one shot — the pipeline is built alongside and Anjoe's pages migrate to manifests one at a time, verified byte-identical.
- v1 SSO is a backend-minted short-lived token + iframe; the full cross-origin native-admin field-panel bridge is a later productization step.

## 3. Feature B — Design Manifest + Build Guideline

### 3.1 Manifest format
One `design.manifest.md` per design, co-located with its components. Human-readable markdown wrapping **one** fenced YAML data block (the machine-readable source of truth). One file to "throw in."

Schema (per design):

```yaml
design: <key>            # unique design key, also stored on page_layout.design_key
route: <path>            # the storefront route this design renders, or null for chrome/template
sections:
  - id: <stable-id>      # stable across edits; maps to component + DOM anchor
    component: <ComponentName>   # resolved from the design's component registry
    label: <string>
    fields:
      - { name, type, default?, options?, accept?, ... }   # type ∈ text|textarea|richtext|media|select|color|number|toggle|product-ref|route-ref
    list:                # optional nested list (cards/reviews/reels/chapters)
      name: <prop>
      itemLabel: "<template with {field}>"
      fields: [ ... ]    # same field kinds, per item
    animations:
      - name: <string>
        preset: <presetKey>        # from the motion preset library, OR `custom`
        editorFallback: static|reduced|none   # what to render when puck.isEditing
        knobs:                     # each knob compiles to ONE control (bar)
          <knobName>: { range:[min,max], step?, unit?, ease?, toggle?, options?, auto?, default }
```

Notes baked into the schema:
- `editorFallback: static` encodes the **"scroll section renders blank in editor"** fix as data (the DiveInScience lesson) — never re-discovered.
- `knobs.<x>.auto: <listName>` lets a knob auto-derive from a list length (solves the deferred **auto-scale 440vh track to chapter count** TODO).
- Field kinds `product-ref`/`route-ref` are typed so the editor renders pickers, not raw text.

### 3.2 The compiler — `manifestToConfig`
Pure function: manifest → `{ puckConfig, pages, defaults }`.
- Parses the YAML block out of the `.md`.
- For each section → a Puck component: `fields` (text→text, media→upload MediaField, list→arrayField with nested fields, animation knobs→range/ease-select/toggle grouped under an "Animation" panel), `defaultProps` from declared defaults.
- `render` binds props to the real component (resolved via the design's component registry) and applies `editorFallback` when `puck.isEditing`.
- Emits the `PAGES`-registry entry (replacing hand-written `pages.js` configs as designs migrate).
- **Regression contract:** for Anjoe's existing pages, the compiler output must be functionally equivalent to today's hand-written config — verified byte-identical on the production build.

### 3.3 Motion preset library — `src/motion/presets/`
A small set of parameterized animations the manifests reference: `fade-up`, `stagger-in`, `scroll-chapter`, `parallax`, `reveal-on-view` (extensible). Each preset:
- declares its knobs + sane defaults,
- exposes a `static`/`reduced` fallback for the editor,
- is driven entirely by props the compiler feeds from manifest knobs.
Bespoke animations are allowed but must declare every magic number as a knob → that's why "every animation becomes a bar."

### 3.4 Build guideline + scaffold
- `DESIGN-BUILD-GUIDE.md` — the SOP Claude follows when authoring any design: one component per section; every literal → a prop, **default = current value**; animations via presets or declared knobs; stable section ids; typed refs; emit the manifest.
- `create-design` scaffold (script/template) — generates a design folder skeleton + a starter manifest so every future design self-manifests by construction.

## 4. Feature A — Studio into Medusa admin

### 4.1 Admin route
- `eps-talous-ecom-service/.../src/admin/routes/theme-editor/page.tsx` → a **"Theme Editor"** nav item in the Medusa admin.
- Hosts the editor shell. Save draft / Publish call the existing **already-admin-gated** `/admin/page-layouts/:slug` (+ `/publish`) routes, same-origin, native admin auth.

### 4.2 Canvas via iframe + edit mode
- Storefront exposes an edit-mode canvas route (e.g. `/__studio-canvas?slug=…`) that mounts the manifest-driven editor in Puck edit mode.
- Admin route embeds it in an iframe. v1: the field panels live in the iframe (reuses the whole existing editor); cross-origin **postMessage bridge** carries layout down / selection up. (Native-admin field panels = later evolution.)

### 4.3 SSO (kills the localStorage JWT)
- Backend endpoint mints a **short-lived signed token** for the logged-in admin; the admin route passes it to the iframe; the canvas validates it to authorize draft/publish.
- **Deletes:** standalone storefront `/studio` login UI + the **admin JWT in localStorage**. Closes the open security TODO.

## 5. Shared data model
- `page_layout`: add `design_key` (validates a layout against its manifest). `tenant_id` stays reserved (multi-client productization).
- New (storefront): manifest registry (scan `src/designs/**/design.manifest.md`), the compiler, the motion preset library.
- New (backend/admin): the Theme Editor route + the SSO token endpoint.
- DB change on prod applied via the **psql-direct workaround** (Medusa CLI migrate hangs on locking-redis — documented gotcha).

## 6. Build order (single-threaded, "build together")
1. Manifest schema + compiler + motion presets → convert **Anjoe home** first (prove byte-identical on the production build).
2. Medusa admin **Theme Editor route + SSO iframe** wrapping the manifest-driven editor.
3. Convert remaining Anjoe pages → manifests; delete standalone `/studio` + localStorage JWT.
4. `DESIGN-BUILD-GUIDE.md` + `create-design` scaffold.

## 7. Testing & verification
- **Compiler unit tests:** manifest → expected Puck config (fields, defaults, list, animation knobs, editorFallback).
- **Regression:** each converted Anjoe page renders **byte-identical** to current — verified on the **production build** (`anjoe-dist` / `npm run preview`), not dev-HMR (staleness gotcha).
- **Editor smoke:** every manifest-declared control appears and edits live; scroll sections are visible in-editor (editorFallback works).
- **Admin route:** opens in Medusa admin, SSO token authorizes save/publish, no localStorage JWT remains; all storefront routes return 200 post-publish.

## 8. Risks
- Bespoke animation knobs depend on guideline discipline (accepted trade with "we control the design").
- Cross-origin admin↔storefront iframe + postMessage bridge + SSO token are the genuinely new plumbing — needs care.
- Compiler must not drift from hand-written behavior — the byte-identical regression gate is the guard.

## 9. Pre-existing security TODOs (flag at ship)
- **Rotate the talos sudo password** (compromised in transcript).
- **Change the dev admin password** `admin@anjoe.local` / `Dev!Anjoe2026` before client-facing.

## 10. Productization seam
This is the compounding asset: a **design-import → auto-editable pipeline** + a Shopify-style in-admin editor. With `tenant_id` + per-tenant theming + role-gated editor + strong auth, it becomes the multi-client EPS store-builder product ("we run your store + ads + finance as one AI-operated stack").
