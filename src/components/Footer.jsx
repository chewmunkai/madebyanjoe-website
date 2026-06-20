import { Link } from 'react-router-dom'

const year = 2026

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img className="footer__logo" src={`${import.meta.env.BASE_URL}anjoe-logo-white.png`} alt="ANJOE Raw Beauté" />
          <p className="footer__tag">
            Raw Beauté — plant-based, probiotic skincare engineered for deep
            hydration and a resilient barrier.
          </p>
          <form
            className="footer__news"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter signup"
          >
            <input
              type="email"
              required
              placeholder="Email address"
              aria-label="Email address"
            />
            <button type="submit" aria-label="Subscribe">
              →
            </button>
          </form>
        </div>

        <nav className="footer__col">
          <h4>Shop</h4>
          <Link to="/shop">All products</Link>
          <Link to="/shop">Sets &amp; bundles</Link>
          <Link to="/shop">Tools</Link>
          <Link to="/product/probiotic-amino-cleanser">Bestsellers</Link>
        </nav>

        <nav className="footer__col">
          <h4>Company</h4>
          <Link to="/about">About us</Link>
          <Link to="/careers">Careers</Link>
          <a href="https://www.madebyanjoe.com/blog" target="_blank" rel="noreferrer">
            Journal
          </a>
          <Link to="/contact">Contact</Link>
        </nav>

        <nav className="footer__col">
          <h4>Support</h4>
          <Link to="/faq">FAQ</Link>
          <Link to="/shipping">Shipping &amp; returns</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
      </div>

      <div className="container footer__base">
        <span>© {year} Medicircle Holding Sdn Bhd. All rights reserved.</span>
        <div className="footer__social">
          <a href="https://www.instagram.com/madebyanjoe" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://www.facebook.com/madebyanjoe" target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href="https://www.youtube.com/watch?v=bjn2UrUF5Sw" target="_blank" rel="noreferrer">
            YouTube
          </a>
        </div>
      </div>
    </footer>
  )
}
