# MadeByAnjoe — Website (ANJOE · Raw Beauté)

Awwwards-grade rebuild of the ANJOE e-commerce experience — a Vite + React app
with GSAP/Lenis scroll, a WebGL water-drop hero (in progress), and a real cart.

## Stack

- **Vite + React 18** (SPA, `react-router-dom`)
- **GSAP + ScrollTrigger + Lenis** — smooth scroll & scroll-driven animation
- **three / @react-three/fiber / @react-three/drei** — WebGL water-drop hero
- **zustand** — cart state (persisted)
- Brand design tokens ported from the Claude Design handoff (`src/styles/tokens.css`)

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

`npm run build` → production bundle in `dist/`. `npm run preview` to serve it.

> Note: the dev server runs under Node (Vite). A `python3 -m http.server` config
> won't work from `~/Documents` under the Claude Preview sandbox (macOS TCC blocks
> `os.getcwd()`), which is why `.claude/launch.json` uses `npm run dev`.

## Structure

```
index.html              Vite entry
src/
  main.jsx              app bootstrap (mounts router, imports styles)
  App.jsx               routes + smooth scroll + scroll-reveal
  styles/               tokens.css · global.css · components.css
  lib/                  SmoothScroll.jsx (Lenis+GSAP) · checkout.js (commerce adapter)
  store/cart.js         zustand cart (persisted to localStorage)
  data/products.js      real catalog (30 products) + pricing from madebyanjoe.com
  components/           Nav · Footer · ProductCard · CartDrawer
  pages/                Home · Shop · Product · About
public/                 favicon, static assets
design-reference/       original Claude Design prototype (kept for mining only)
```

## Commerce

Checkout is **provider-agnostic and not faked**. `src/lib/checkout.js` throws
`CheckoutNotConfiguredError` until a provider + keys are supplied via env
(`VITE_COMMERCE_PROVIDER` = `snipcart` | `shopify` | `stripe`). The cart UI shows
an honest "not live yet" state until then. Recommended: Snipcart (drop-in) or
Shopify Storefront.

## Status

Phase 1: Home (placeholder hero) · Shop · Product · About · cart. **Next:** the
WebGL water-drop scroll-scrub hero (needs a clean bottle packshot on transparent
background). Images currently hotlink the appolous CDN; mirror to `public/` for
production resilience.

© 2026 Medicircle Holding Sdn Bhd.
