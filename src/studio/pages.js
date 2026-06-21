import { config as homeConfig } from './homepage.config.jsx'
import { SECTIONS as homeSections, defaultHomepage } from './homepage.js'
import { config as aboutConfig } from './about.config.jsx'
import About from '../pages/About.jsx'

/* Registry of editable pages. Each entry pairs a backend slug with its Puck config,
   its component registry (for rendering the published layout), and a default layout.
   The studio edits any of these; the live routes render them via PageView. */
const aboutDefault = { root: { props: {} }, content: [{ type: 'AboutPage', props: { id: 'about' } }] }

export const PAGES = {
  home: { key: 'home', label: 'Homepage', slug: 'home', path: '/', config: homeConfig, sections: homeSections, defaultLayout: defaultHomepage },
  about: { key: 'about', label: 'About', slug: 'about', path: '/about', config: aboutConfig, sections: { AboutPage: About }, defaultLayout: aboutDefault },
}

// Guard against an empty/garbage layout — fall back to the page's default.
export function layoutOr(layout, fallback) {
  return layout && Array.isArray(layout.content) && layout.content.length ? layout : fallback
}
