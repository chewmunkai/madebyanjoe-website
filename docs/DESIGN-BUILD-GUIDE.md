# Design Build Guide — how to build a design that self-manifests

This is the SOP for building any storefront design so that the no-code editor
(`/studio`, also embedded in the Medusa admin as **Theme Editor**) **orients itself
automatically**. You build the design to this guide; it emits a **manifest** that
declares its whole editable surface; you drop the manifest + components in; the editor
generates every control ("bar") for content, media, lists, and animations — with **no
per-design editor wiring**.

> Golden rule: **prop-drive everything, with the current value as the default.** The
> page is byte-identical until something is edited.

---

## The three pieces

1. **Components** (`src/sections`, `src/hero`, …) — each section is one React component.
   Every editable literal is a **prop** with the current value as its default. Every
   animation knob (duration, ease, distance, …) is a **prop** the component reads.
2. **Design module** (`src/designs/<key>/<key>.js`) — exports `{ components, defaults }`:
   the section name → component map, and (for migrated designs) verbatim default props.
   New designs can instead put content inline in the manifest and keep `defaults` empty.
3. **Manifest** (`src/designs/<key>/<key>.manifest.md`) — human-readable markdown
   wrapping **one** `​```yaml` block that declares sections, fields, lists, and
   animations. This is the "throw it in and the editor is oriented" file.

The compiler (`src/studio/manifest/compile.jsx`) stitches manifest + module into a
`PAGES` entry — the editor config + the live-render registry + the default layout.

---

## Manifest schema (reference)

```yaml
design: <key>          # unique; also stored on page_layout.design_key
label: <Title>         # shown in the studio page switcher
slug: <backend-slug>   # the page_builder slug the layout persists under
route: <path | null>   # storefront route, or null for chrome/template settings

sections:
  - id: <stable-id>            # stable across edits → the block id in the layout
    component: <ComponentName> # must exist in the design module's `components`
    label: <Title>             # block label in the editor
    editorOverrides: { <prop>: <value> }   # props injected ONLY while editing (see below)
    fields:
      - { name, type, label, default?, options? }
    list:  # OR put a list field inside `fields` with type: list
    animations:
      - { name, preset, editorFallback, editorFallbackProp, knobs }
```

### Field types → editor controls
| type | control | notes |
|------|---------|-------|
| `text` | text input | |
| `textarea` / `richtext` | multiline | |
| `number` | number input | |
| `toggle` | On/Off | stores `'on'` / `'off'` |
| `select` | dropdown | `options: [{label,value}]` or `['a','b']` |
| `color` | text (hex) | upgrade to a swatch later |
| `media` | upload + URL paste | image or video, stored in Medusa files |
| `product-ref` / `route-ref` | text | typed for future pickers |
| `list` | repeatable group | needs `fields:`, `itemLabel`, optional `itemFallback` |

**List example** (nested cards/reviews/chapters):
```yaml
- name: chapters
  type: list
  label: 'Scroll chapters'
  itemLabel: '{t}'          # {field} → item value; {#} → 1-based index
  itemFallback: 'Chapter'
  fields:
    - { name: t, type: text, label: 'Title' }
    - { name: d, type: textarea, label: 'Description' }
    - { name: slug, type: product-ref, label: 'Product' }
```

### Animations → bars (the whole point)
Reference a **preset** from `src/motion/presets`; each preset's **knobs** become controls
(a slider for ranges, an easing dropdown, an On/Off for toggles). Declare bespoke
animations the same way — expose every magic number as a knob.
```yaml
animations:
  - name: heroReveal
    preset: fade-up                 # fade-up | stagger-in | scroll-chapter | parallax | reveal-on-view
    editorFallback: static          # render the reduced-motion layout in the editor
    editorFallbackProp: animation   # which prop to set to 'off' while editing
    knobs:                          # override preset defaults if you like
      duration: { range: [0, 2], step: 0.05, unit: s, default: 0.8 }
```
The component receives the knobs as an object prop named after the animation
(`props.heroReveal = { duration, ease, … }`).

---

## The two animation gotchas, encoded as data

1. **Scroll/scrub sections render blank in the editor** (the scroll never fires, so
   content sits at `opacity:0`). Declare an `editorFallback` so the section shows its
   static layout while editing. For a simple on/off section, use
   `editorOverrides: { animation: 'off' }`; for a preset, set `editorFallback: static`
   + `editorFallbackProp: <prop>`. (The hero uses `editorOverrides: { motionless: true }`.)
2. **Auto-scale a scroll track to a list** — set a knob's `auto: <listName>` so e.g. a
   440vh dive-in-science track scales to the chapter count instead of being hardcoded.

---

## Recipe: add a new editable design

1. **Scaffold:** `npm run create-design -- <key> [route]` → creates
   `src/designs/<key>/<key>.manifest.md` + `<key>.js`.
2. **Build the components** to the golden rule (prop-driven, default = current value;
   animations via presets/knobs; stable section ids).
3. **Fill the manifest** — one section per component, list every editable field, declare
   animations + knobs, set `editorFallback` on any scroll section.
4. **Register** in `src/studio/pages.js`:
   ```js
   import { compileManifest } from './manifest/compile.jsx'
   import md from '../designs/<key>/<key>.manifest.md?raw'
   import * as mod from '../designs/<key>/<key>.js'
   // …
   '<key>': compileManifest(md, mod),
   ```
5. **Render it live** — a page route via `<PageView page={PAGES['<key>']} />`, or for
   global chrome/templates via `usePublishedProps('<slug>')`.

That's it — the editor now has every control for that design, generated from the manifest.

---

## What deliberately stays in code (design, not content)
Bespoke WebGL/SVG/computed visuals (e.g. a refraction lens, a great-circle globe, a live
clock) are the line that keeps a site bespoke rather than generic. Editing those is a dev
change, by design. Expose their *content* (labels, toggles) as props; keep their *logic*
in the component.

## Build/deploy gotchas (storefront)
- **Verify on the production build** (`npm run build` → `npm run preview`), **not** the
  dev server — dev HMR can serve stale studio modules after registry edits.
- **Vite base must be `/`** for the talos deploy: `MSYS_NO_PATHCONV=1 VITE_BASE=/ npm run
  build` in Git Bash (a bare `/` gets path-mangled), or `$env:VITE_BASE='/'` in PowerShell.
- **Prices are DECIMAL major units** in Medusa v2 (218 = RM218, not cents).
