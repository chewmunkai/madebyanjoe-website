import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCart, selectCount } from '../store/cart.js'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const count = useCart(selectCount)
  const open = useCart((s) => s.open)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="nav__inner container">
        <nav className="nav__group nav__group--left">
          <NavLink to="/shop" className="navlink">
            Shop
          </NavLink>
          <NavLink to="/about" className="navlink">
            About
          </NavLink>
        </nav>

        <Link to="/" className="nav__brand wordmark" aria-label="ANJOE home">
          ANJOE
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
