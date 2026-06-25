import { home } from './homepage.js'
import { config as aboutConfig } from './about.config.jsx'
import About from '../pages/About.jsx'
import Contact from '../pages/Contact.jsx'
import FAQ from '../pages/FAQ.jsx'
import Shipping from '../pages/Shipping.jsx'
import Careers from '../pages/Careers.jsx'
import Legal from '../pages/Legal.jsx'
import { contactConfig, faqConfig, shippingConfig, careersConfig, privacyConfig, termsConfig } from './content-configs.jsx'
import Shop from '../pages/Shop.jsx'
import SiteChrome from './SiteChrome.jsx'
import ProductSettings from './ProductSettings.jsx'
import { siteConfig } from './site.config.jsx'
import { shopConfig, productConfig } from './store-configs.jsx'

/* Registry of editable pages. Each pairs a backend slug with its Puck config, its
   component registry (for rendering the published layout), and a default layout.
   The studio edits any of these (page switcher); the live routes render them via
   PageView. Single-block pages render unchanged from defaults until edited. */
const single = (type, props = {}) => ({ root: { props: {} }, content: [{ type, props: { id: type, ...props } }] })
// Seed the editor block with the config's defaultProps so the fields load PRE-FILLED
// with the page's current copy instead of blank. The canvas is unchanged — these
// defaults mirror the component's in-code defaults. (A saved draft still overrides this.)
const seeded = (type, config) => single(type, config?.components?.[type]?.defaultProps || {})

export const PAGES = {
  home,
  about: { key: 'about', label: 'About', slug: 'about', path: '/about', config: aboutConfig, sections: { AboutPage: About }, defaultLayout: seeded('AboutPage', aboutConfig) },
  contact: { key: 'contact', label: 'Contact', slug: 'contact', path: '/contact', config: contactConfig, sections: { ContactPage: Contact }, defaultLayout: seeded('ContactPage', contactConfig) },
  faq: { key: 'faq', label: 'FAQ', slug: 'faq', path: '/faq', config: faqConfig, sections: { FaqPage: FAQ }, defaultLayout: seeded('FaqPage', faqConfig) },
  shipping: { key: 'shipping', label: 'Shipping', slug: 'shipping', path: '/shipping', config: shippingConfig, sections: { ShippingPage: Shipping }, defaultLayout: seeded('ShippingPage', shippingConfig) },
  careers: { key: 'careers', label: 'Careers', slug: 'careers', path: '/careers', config: careersConfig, sections: { CareersPage: Careers }, defaultLayout: seeded('CareersPage', careersConfig) },
  'legal-privacy': { key: 'legal-privacy', label: 'Privacy', slug: 'legal-privacy', path: '/privacy', config: privacyConfig, sections: { LegalPage: Legal }, defaultLayout: seeded('LegalPage', privacyConfig) },
  'legal-terms': { key: 'legal-terms', label: 'Terms', slug: 'legal-terms', path: '/terms', config: termsConfig, sections: { LegalPage: Legal }, defaultLayout: seeded('LegalPage', termsConfig) },
  shop: { key: 'shop', label: 'Shop', slug: 'shop', path: '/shop', config: shopConfig, sections: { ShopPage: Shop }, defaultLayout: seeded('ShopPage', shopConfig) },
  product: { key: 'product', label: 'Product template', slug: 'product', path: '/product/probiotic-amino-cleanser', config: productConfig, sections: { ProductSettings }, defaultLayout: seeded('ProductSettings', productConfig) },
  site: { key: 'site', label: 'Header & footer', slug: 'site', path: '/', config: siteConfig, sections: { SiteChrome }, defaultLayout: seeded('SiteChrome', siteConfig) },
}

// Guard against an empty/garbage layout — fall back to the page's default.
export function layoutOr(layout, fallback) {
  return layout && Array.isArray(layout.content) && layout.content.length ? layout : fallback
}
