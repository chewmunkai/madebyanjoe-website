# MadeByAnjoe — Website

E-commerce site for **ANJOE — Raw Beauté**. The current implementation is a Claude Design
handoff prototype: a static, in-browser-transpiled React page with **no build step**.

## Run locally

The page loads its `.jsx` via Babel standalone, which `fetch`es those files — so it **must be
served over HTTP** (not opened as a `file://` URL). Serve from the **repo root** (the page
references `../_ds/…`, a sibling of `site/`).

Dev-server configs live in [`.claude/launch.json`](.claude/launch.json). Either:

```bash
# zero-dependency (Python is preinstalled on macOS)
python3 -m http.server 8000
# → open http://localhost:8000/site/index.html

# or, nicer MIME/caching (downloads `serve` on first run)
npx -y serve -l 3000 .
# → open http://localhost:3000/site/index.html
```

## Structure

```
site/                 the page
  index.html          entry — wires React / Three.js / lucide (CDN) + the JSX below
  app.jsx             root React app
  sections.jsx        page sections
  tweaks-panel.jsx    live design-tweak panel
  three-hero.js       Three.js hero animation
  assets/             logos
_ds/                  exported design system (tokens, styles, bundle)
DESIGN-HANDOFF.md     original Claude Design handoff notes
```

## Notes

- React 18, Three.js, and lucide load from the **unpkg CDN** — an internet connection is
  required to render.
- JSX is transpiled **in the browser** via `@babel/standalone`. Fine for the prototype; a
  production build (Vite/Next) would precompile it for speed.
