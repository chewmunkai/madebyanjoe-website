import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import SmoothScroll from './lib/SmoothScroll.jsx'
import Preloader from './lib/Preloader.jsx'
import Cursor from './lib/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import AboutPage from './pages/AboutPage.jsx'
import Login from './pages/Login.jsx'
import Account from './pages/Account.jsx'
import PromoPage from './pages/PromoPage.jsx'
import PromoBanner from './components/PromoBanner.jsx'
import PageView from './studio/PageView.jsx'
import { PAGES } from './studio/pages.js'
import { usePublishedProps } from './studio/usePublishedProps.js'
import { useAnalytics } from './lib/analytics.js'

// Visual homepage editor — lazy so Puck never bloats the storefront bundle.
const Studio = lazy(() => import('./studio/Studio.jsx'))

/* Reveal-on-scroll for any .reveal element. Re-scans on route change AND watches for
   elements that mount asynchronously — catalog-driven cards (PDP "Complete the ritual",
   Shop grid) re-render once live data hydrates, AFTER a one-time scan would have run, so
   they'd never be observed and would stay stuck at opacity:0. A MutationObserver re-runs
   the scan whenever new nodes appear (io.observe on an already-observed node is a no-op). */
function useScrollReveal(dep) {
  useEffect(() => {
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
    const observeAll = () => document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => io.observe(el))
    observeAll()
    let raf = 0
    const mo = new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(observeAll) })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { cancelAnimationFrame(raf); io.disconnect(); mo.disconnect() }
  }, [dep])
}

export default function App() {
  const { pathname } = useLocation()

  // Per-tenant GA4/GTM → makes this store discoverable by Talous (self-skips the editor).
  useAnalytics()

  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname])

  useScrollReveal(pathname)

  // Global header/footer content is editable site chrome (slug 'site').
  const chrome = usePublishedProps('site')

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
      <PromoBanner />
      <Nav {...chrome} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<PageView page={PAGES.shop} />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<PageView page={PAGES.contact} />} />
          <Route path="/faq" element={<PageView page={PAGES.faq} />} />
          <Route path="/shipping" element={<PageView page={PAGES.shipping} />} />
          <Route path="/careers" element={<PageView page={PAGES.careers} />} />
          <Route path="/privacy" element={<PageView page={PAGES['legal-privacy']} />} />
          <Route path="/terms" element={<PageView page={PAGES['legal-terms']} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/promo/:slug" element={<PromoPage />} />
        </Routes>
      </main>
      <Footer {...chrome} />
      <CartDrawer />
    </SmoothScroll>
  )
}
