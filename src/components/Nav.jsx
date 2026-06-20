import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCart, selectCount } from '../store/cart.js'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const count = useCart(selectCount)
  const open = useCart((s) => s.open)

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
          <NavLink to="/shop" className="navlink">
            Shop
          </NavLink>
          <NavLink to="/about" className="navlink">
            About
          </NavLink>
          <NavLink to="/faq" className="navlink nav__hide-sm">
            FAQ
          </NavLink>
          <NavLink to="/shipping" className="navlink nav__hide-md">
            Shipping
          </NavLink>
          <NavLink to="/careers" className="navlink nav__hide-md">
            Careers
          </NavLink>
          <NavLink to="/contact" className="navlink nav__hide-sm">
            Contact
          </NavLink>
        </nav>

        <Link to="/" className="nav__brand" aria-label="ANJOE home">
          <img
            className="nav__logo"
            src={`${import.meta.env.BASE_URL}${invert ? 'anjoe-logo-white.png' : 'anjoe-logo.png'}`}
            alt="ANJOE Raw Beauté"
          />
        </Link>

        <div className="nav__group nav__group--right">
          <a
            href="https://www.madebyanjoe.com/blog"
            target="_blank"
            rel="noreferrer"
            className="navlink nav__hide-sm"
          >
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
