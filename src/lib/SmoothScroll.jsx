import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Lenis smooth-scroll driven by GSAP's ticker, with ScrollTrigger kept in sync.
   Respects prefers-reduced-motion by skipping smoothing entirely. */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // expose for components that want to scrollTo()
    window.__lenis = lenis

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  return children
}
