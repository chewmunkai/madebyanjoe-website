import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCart, selectCount } from '../store/cart.js'

/* The nav links + Journal URL are editable as site chrome (in /studio → "Header &
   footer"). Defaults below = the current header; the scroll/invert behaviour, the
   brand logo and the bag stay in code. */
export const DEFAULT_NAV_LINKS = [
  { label: 'Shop', to: '/shop', hide: '' },
  { label: 'About', to: '/about', hide: '' },
  { label: 'FAQ', to: '/faq', hide: 'nav__hide-sm' },
  { label: 'Shipping', to: '/shipping', hide: 'nav__hide-md' },
  { label: 'Careers', to: '/careers', hide: 'nav__hide-md' },
  { label: 'Contact', to: '/contact', hide: 'nav__hide-sm' },
]
export const DEFAULT_JOURNAL_URL = 'https://www.madebyanjoe.com/blog'

export default function Nav({ navLinks = DEFAULT_NAV_LINKS, journalUrl = DEFAULT_JOURNAL_URL } = {}) {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const count = useCart(selectCount)
  const open = useCart((s) => s.open)
  const links = Array.isArray(navLinks) && navLinks.length ? navLinks : DEFAULT_NAV_LINKS

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onHome = pathname === '/'
  /* Light nav over the dark hero film; solid bone nav once scrolled / off-home. */
  const invert = onHome && !scrolled
  const solid = scrolled || !onHome

  return (
    <header className={`nav${solid ? ' nav--solid' : ''}${invert ? ' nav--invert' : ''}`}>
      <div className="nav__inner container">
        <nav className="nav__group nav__group--left">
          {links.map((l) => (
            <NavLink key={l.to + l.label} to={l.to} className={`navlink${l.hide ? ' ' + l.hide : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="nav__brand" aria-label="ANJOE home">
          <img
            className="nav__logo"
            src={`${import.meta.env.BASE_URL}${invert ? 'anjoe-logo-white.png' : 'anjoe-logo.png'}`}
            alt="ANJOE Raw Beauté"
          />
        </Link>

        <div className="nav__group nav__group--right">
          <a href={journalUrl} target="_blank" rel="noreferrer" className="navlink nav__hide-sm">
            Journal
          </a>
          <button className="nav__cart" onClick={open} aria-label="Open bag">
            <span>Bag</span>
            <span className={`nav__count ${count ? 'is-active' : ''}`}>{count}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
