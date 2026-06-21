import { home } from './homepage.js'
import { config as aboutConfig } from './about.config.jsx'
import About from '../pages/About.jsx'
import Contact from '../pages/Contact.jsx'
import FAQ from '../pages/FAQ.jsx'
import Shipping from '../pages/Shipping.jsx'
import Careers from '../pages/Careers.jsx'
import Legal, { TERMS_CONTENT } from '../pages/Legal.jsx'
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

export const PAGES = {
  home,
  about: { key: 'about', label: 'About', slug: 'about', path: '/about', config: aboutConfig, sections: { AboutPage: About }, defaultLayout: single('AboutPage') },
  contact: { key: 'contact', label: 'Contact', slug: 'contact', path: '/contact', config: contactConfig, sections: { ContactPage: Contact }, defaultLayout: single('ContactPage') },
  faq: { key: 'faq', label: 'FAQ', slug: 'faq', path: '/faq', config: faqConfig, sections: { FaqPage: FAQ }, defaultLayout: single('FaqPage') },
  shipping: { key: 'shipping', label: 'Shipping', slug: 'shipping', path: '/shipping', config: shippingConfig, sections: { ShippingPage: Shipping }, defaultLayout: single('ShippingPage') },
  careers: { key: 'careers', label: 'Careers', slug: 'careers', path: '/careers', config: careersConfig, sections: { CareersPage: Careers }, defaultLayout: single('CareersPage') },
  'legal-privacy': { key: 'legal-privacy', label: 'Privacy', slug: 'legal-privacy', path: '/privacy', config: privacyConfig, sections: { LegalPage: Legal }, defaultLayout: single('LegalPage') },
  'legal-terms': { key: 'legal-terms', label: 'Terms', slug: 'legal-terms', path: '/terms', config: termsConfig, sections: { LegalPage: Legal }, defaultLayout: single('LegalPage', TERMS_CONTENT) },
  shop: { key: 'shop', label: 'Shop', slug: 'shop', path: '/shop', config: shopConfig, sections: { ShopPage: Shop }, defaultLayout: single('ShopPage') },
  product: { key: 'product', label: 'Product template', slug: 'product', path: '/product/probiotic-amino-cleanser', config: productConfig, sections: { ProductSettings }, defaultLayout: single('ProductSettings') },
  site: { key: 'site', label: 'Header & footer', slug: 'site', path: '/', config: siteConfig, sections: { SiteChrome }, defaultLayout: single('SiteChrome') },
}

// Guard against an empty/garbage layout — fall back to the page's default.
export function layoutOr(layout, fallback) {
  return layout && Array.isArray(layout.content) && layout.content.length ? layout : fallback
}
