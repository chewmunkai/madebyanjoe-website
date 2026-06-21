import { Link } from 'react-router-dom'

/* The footer's tagline, link columns, copyright and social links are editable as
   site chrome (in /studio → "Header & footer"). Defaults below = the current footer. */
export const DEFAULT_FOOTER_TAGLINE =
  'Raw Beauté — plant-based, probiotic skincare engineered for deep hydration and a resilient barrier.'
export const DEFAULT_FOOTER_COLUMNS = [
  { h: 'Shop', links: [
    { label: 'All products', to: '/shop' },
    { label: 'Sets & bundles', to: '/shop' },
    { label: 'Tools', to: '/shop' },
    { label: 'Bestsellers', to: '/product/probiotic-amino-cleanser' },
  ] },
  { h: 'Company', links: [
    { label: 'About us', to: '/about' },
    { label: 'Careers', to: '/careers' },
    { label: 'Journal', href: 'https://www.madebyanjoe.com/blog' },
    { label: 'Contact', to: '/contact' },
  ] },
  { h: 'Support', links: [
    { label: 'FAQ', to: '/faq' },
    { label: 'Shipping & returns', to: '/shipping' },
    { label: 'Privacy', to: '/privacy' },
    { label: 'Terms', to: '/terms' },
  ] },
]
export const DEFAULT_COPYRIGHT = '© 2026 Medicircle Holding Sdn Bhd. All rights reserved.'
export const DEFAULT_SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/madebyanjoe' },
  { label: 'Facebook', href: 'https://www.facebook.com/madebyanjoe' },
  { label: 'YouTube', href: 'https://www.youtube.com/watch?v=bjn2UrUF5Sw' },
]

function FootLink({ link }) {
  if (link.href) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer">
        {link.label}
      </a>
    )
  }
  return <Link to={link.to}>{link.label}</Link>
}

export default function Footer({
  footerTagline = DEFAULT_FOOTER_TAGLINE,
  footerColumns = DEFAULT_FOOTER_COLUMNS,
  copyright = DEFAULT_COPYRIGHT,
  socials = DEFAULT_SOCIALS,
  newsletterPlaceholder = 'Email address',
} = {}) {
  const columns = Array.isArray(footerColumns) && footerColumns.length ? footerColumns : DEFAULT_FOOTER_COLUMNS
  const social = Array.isArray(socials) && socials.length ? socials : DEFAULT_SOCIALS

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img className="footer__logo" src={`${import.meta.env.BASE_URL}anjoe-logo-white.png`} alt="ANJOE Raw Beauté" />
          <p className="footer__tag">{footerTagline}</p>
          <form
            className="footer__news"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter signup"
          >
            <input
              type="email"
              required
              placeholder={newsletterPlaceholder}
              aria-label="Email address"
            />
            <button type="submit" aria-label="Subscribe">
              →
            </button>
          </form>
        </div>

        {columns.map((col, i) => (
          <nav className="footer__col" key={(col.h || '') + i}>
            <h4>{col.h}</h4>
            {(col.links || []).map((link, j) => (
              <FootLink link={link} key={(link.label || '') + j} />
            ))}
          </nav>
        ))}
      </div>

      <div className="container footer__base">
        <span>{copyright}</span>
        <div className="footer__social">
          {social.map((s, i) => (
            <a href={s.href} target="_blank" rel="noreferrer" key={(s.label || '') + i}>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
