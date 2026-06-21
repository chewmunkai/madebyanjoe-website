import { compileManifest } from './manifest/compile.jsx'
import homeManifest from '../designs/anjoe/home.manifest.md?raw'
import * as homeDesign from '../designs/anjoe/home.js'

/* The homepage is manifest-driven: home.manifest.md declares the editable surface,
   home.js supplies the real components + verbatim defaults, and the compiler produces
   the editor config + the live-render registry + the default layout — all from ONE
   source. Both /studio (editor) and Home.jsx (live render) consume this, so the editor
   and the live page can never drift, and the page stays byte-identical until edited. */

export const home = compileManifest(homeManifest, homeDesign)

// Back-compat exports for Home.jsx — derived from the compiled design.
export const SECTIONS = home.sections
export const HOME_SLUG = home.slug
export const defaultHomepage = home.defaultLayout

// Guard against an empty/garbage layout — fall back to the default composition.
export function normalizeLayout(layout) {
  return layout && Array.isArray(layout.content) && layout.content.length ? layout : defaultHomepage
}
