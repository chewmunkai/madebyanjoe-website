import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import SmoothScroll from './lib/SmoothScroll.jsx'
import Preloader from './lib/Preloader.jsx'
import Cursor from './lib/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Product from './pages/Product.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import FAQ from './pages/FAQ.jsx'
import Shipping from './pages/Shipping.jsx'
import Careers from './pages/Careers.jsx'
import Legal from './pages/Legal.jsx'

// Visual homepage editor — lazy so Puck never bloats the storefront bundle.
const Studio = lazy(() => import('./studio/Studio.jsx'))

/* Reveal-on-scroll for any .reveal element. Re-scans on route change. */
function useScrollReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.is-in)')
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [dep])
}

export default function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname])

  useScrollReveal(pathname)

  // The studio renders full-screen, outside the store chrome (Nav/Footer/SmoothScroll).
  if (pathname.startsWith('/studio')) {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Manrope, sans-serif' }}>Loading studio…</div>}>
        <Routes>
          <Route path="/studio" element={<Studio />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <SmoothScroll>
      <Preloader />
      <Cursor />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy" element={<Legal doc="privacy" />} />
          <Route path="/terms" element={<Legal doc="terms" />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </SmoothScroll>
  )
}
