import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import SmoothScroll from './lib/SmoothScroll.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Product from './pages/Product.jsx'
import About from './pages/About.jsx'

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

  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </SmoothScroll>
  )
}
