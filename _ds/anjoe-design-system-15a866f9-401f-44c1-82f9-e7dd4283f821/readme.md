# ANJOE Raw Beauté — Design System

A design system for **MadeByAnjoe** ([madebyanjoe.com](https://www.madebyanjoe.com/)), a Malaysian plant-based skincare and beauty-tools brand. The line spans serums, essences, oils, moisturisers and the brand's signature whale-shaped gua sha tool. Voice and aesthetic are **clean & clinical meets luxe & elegant** — gentle, trustworthy, dermatology-grade, but warm.

> **Sources used to build this system**
> - `uploads/IMG_9590.png` — the ANJOE Raw Beauté logo (navy Trajan wordmark + blue/blush whale mark). Brand palette was sampled directly from this file.
> - Live storefront: https://www.madebyanjoe.com/ — product names, RM pricing, copy voice, product photography (hot-linked from the brand CDN `img.appolous.com`).
> No codebase or Figma was provided; foundations are derived from the logo + live site.

---

## Brand at a glance
- **Products:** plant-based skincare (serums, essence water, treatment oils, creams) + facial tools (whale gua sha).
- **Market:** Malaysia — prices in **Malaysian Ringgit (RM)**.
- **Positioning:** "Raw Beauté" — handcrafted, allergy-safe, dermatologically tested, 100% plant-based, gentle on sensitive/eczema/acne-prone skin.
- **Mascot/motif:** a stylised **whale** (the gua sha tool) rendered in whale-blue with a blush-pink belly.

---

## CONTENT FUNDAMENTALS

**Voice:** calm, reassuring, quietly premium. Reads like a thoughtful dermatologist who also has taste. Never hype-y, never shouty.

- **Person:** addresses the customer as **you** ("gentle on *your* skin", "*your* daily ritual"); the brand refers to itself as **we / ANJOE**.
- **Casing:** Sentence case for body and headlines. **UPPERCASE, heavily letter-spaced** reserved for the wordmark, eyebrows, nav labels and button text. Never all-caps full sentences.
- **Tone words:** *gentle, clean, plant-based, resilient, radiant, hypoallergenic, barrier, ritual, dermatologically tested.*
- **Claims style:** specific and substantiated — "dermatologically tested", "100% plant-based extract", "KKM certified", volume in ML. Avoid vague superlatives.
- **Punctuation:** the accented **é** in *Beauté* is part of the brand. Mid-dashes (—) for elegant asides. Minimal exclamation.
- **Emoji:** **none.** The brand never uses emoji. Iconography is line-based and restrained.
- **Currency:** always `RM 258.00` — "RM", space, two decimals.

*Examples (in brand voice):*
- "Skincare gentle enough to trust, powerful enough to work."
- "Handcrafted, allergy-safe formulas made with clean, plant-based ingredients."
- "A daily moment of care, sculpted by hand."

---

## VISUAL FOUNDATIONS

**Color.** Cool, clinical base warmed by a single blush accent. Sampled from the mark:
- **Navy ink `#2C3A49`** — the wordmark colour; primary for text, buttons, footer.
- **Whale-blue `#A6C7D8`** + **pale blue `#C9E7F2`** — soft cool surfaces, fills, washes.
- **Blush `#EFB8CB`** + **pale blush `#F7DCE4`** — the warm accent; used *sparingly* (badges, ritual band, highlights), never as a dominant field.
- **Neutrals are warm** — page is **paper `#FBFAF8`**, not stark white. Ink ramps from `#1E2935` → `#7B8794`.
- Semantic: success sage `#5E9B7E`, warning gold `#C9A24B`, error/sale terracotta `#C56B6B`.

**Type.** Four voices (see *Type substitution* below):
- **Cinzel** (Trajan caps) — the wordmark voice. Wordmark, brand seals. Always UPPERCASE + 0.22–0.42em tracking. Sparing.
- **Instrument Serif** — tall, high-contrast display. Headlines, product names, pull quotes. Characterful and contemporary; regular + italic only (no bold — by design). Slight negative tracking at large sizes.
- **Schibsted Grotesk** — crisp modern grotesque. All UI, body copy, navigation, prices, buttons. Body 16px / line-height 1.7.
- **Spline Sans Mono** — clinical "lab-grade" mono for eyebrows, spec labels and technical data ("30ML", "001 / 006", "pH 5.5"). Tracked uppercase. The signature clinical detail.

**Spacing & layout.** Generous, editorial whitespace on a **4px scale**. Centred max-width container (1280px). Sections breathe with 96px vertical padding. Three-up product grids on desktop.

**Backgrounds.** Mostly flat paper. The signature treatment is a **soft radial wash** blending whale-blue → white → blush (hero, brand washes) — gentle, never a harsh or purple gradient. Navy is used as a solid band (value strip, footer). No textures, no patterns, no photographic full-bleed backdrops. Product photography sits in **pale-blue tiles**.

**Corner radii.** Restrained. Cards/images use `lg 14px` / `xl 22px`; buttons & inputs use a small `sm 4px`. Pills (`999px`) only for tags/chips. Nothing bubbly.

**Cards.** White surface, **1px hairline border** (`--line` warm grey), soft radius, very faint shadow at rest; interactive cards lift `-2px` with a `shadow-md` on hover. Product images bleed to the card edge (`padding="none"`).

**Shadows.** Faint, cool, **navy-hued** (built on `rgba(30,41,53, …)`), never neutral grey, never heavy. Like soft daylight. Five steps `xs → lg` plus a `blue` glow for emphasis.

**Borders.** Hairlines everywhere — `1px` warm `--line` on paper, `--line-cool` on blue surfaces, `1.5px` for input/button strokes.

**Motion.** Gentle, quiet, **no bounce**. Standard easing `cubic-bezier(0.4,0,0.2,1)`, soft `ease-out` for entrances. Durations 140/240/420ms. Hovers fade & lift; images scale `1.04` slowly. Quiet-luxury restraint.

**Hover states.** Primary button → darkens to navy-deep. Secondary outline → fills navy. Ghost/icon → pale-blue `--blue-50` wash. Cards → lift + shadow. Links → 0.7 opacity. **No** colour-shift to bright hues.

**Press/active.** Subtle — colour deepen, no aggressive shrink.

**Transparency & blur.** Used for the **sticky header** (`rgba(paper,0.86)` + `blur(12px)`) and the **cart overlay** (`rgba(navy,0.4)` + slight blur). Wishlist button on imagery uses a translucent white + blur. Otherwise surfaces are opaque.

**Imagery vibe.** Clean studio product shots, soft natural light, cool-neutral cast, lots of negative space. Calm and editorial.

---

## ICONOGRAPHY

- **System:** [**Lucide**](https://lucide.dev) — thin, rounded line icons (≈1.5–2px stroke). Matches the brand's delicate, clinical line aesthetic. Loaded from CDN (`unpkg.com/lucide`) and rendered with `<i data-lucide="name"></i>` + `lucide.createIcons()`.
- **Style:** outline only, never filled (except the gold star in `Rating`). Sizes 15–20px in UI.
- **Common glyphs:** `search`, `user`, `shopping-bag`, `heart`, `plus`/`minus`, `chevron-down`, `arrow-left`, `trash-2`, `leaf`, `shield-check`, `sparkles`, `truck`, `star`.
- **Emoji:** never used.
- **Unicode:** the accented **é** in *Beauté*; the `—` em dash. No emoji-as-icon.
- **Brand mark:** the whale + ANJOE wordmark live as raster assets in `assets/` (`anjoe-logo.png`, `anjoe-logo-white.png` for dark grounds). Do **not** redraw the whale in SVG.

*If you need an icon Lucide doesn't have, pick the nearest Lucide glyph rather than mixing icon sets.*

---

## Type substitution (action needed)
The brand's wordmark is a licensed classical Trajan capital and the site uses licensed display/text faces we don't have files for. This system substitutes the closest free Google Fonts:
- Wordmark Trajan → **Cinzel**
- Display serif → **Instrument Serif** (tall, high-contrast)
- UI sans → **Schibsted Grotesk**
- Mono detail → **Spline Sans Mono**

**→ If you have the brand's licensed fonts, send the files and I'll swap them into `tokens/fonts.css`.**

---

## Index / manifest

**Root**
- `styles.css` — global entry point (import this). `@import`s the four token files.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skills front-matter wrapper.

**`tokens/`** — `fonts.css` (@font-face + Google Fonts), `colors.css`, `typography.css`, `spacing.css` (spacing/radius/shadow/motion/layout).

**`assets/`** — `anjoe-logo.png`, `anjoe-logo-white.png` (and source `uploads/IMG_9590.png`).

**`foundations/`** — specimen cards for the Design System tab: colors (core, blue, blush, neutral/semantic), type (wordmark, display, ui, scale), spacing (scale, radius, shadows), brand (logo, wash).

**`components/`** — reusable primitives (see prompts beside each):
- `core/` — `Button`, `IconButton`, `Badge`, `Tag`
- `forms/` — `Input`, `QuantityStepper`
- `surfaces/` — `Card`, `Accordion`
- `commerce/` — `Rating`, `ProductCard`

**`ui_kits/storefront/`** — interactive e-commerce recreation (Home → Product detail → Cart drawer). Entry: `index.html`. See its own `README.md`.

**Usage in cards/kits:** link `styles.css`, load `_ds_bundle.js`, then `const { Button, ProductCard } = window.ANJOEDesignSystem_15a866`.
