import { useRef } from 'react'
import gsap from 'gsap'

/* Wraps an interactive element so it drifts toward the cursor while hovered and
   springs back on exit. Pure transform on a wrapper span — the child keeps all
   its native click/focus behaviour. No-op under reduced motion. */
export default function Magnetic({ children, strength = 0.4, className }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = el.getBoundingClientRect()
    const x = (e.clientX - (box.left + box.width / 2)) * strength
    const y = (e.clientY - (box.top + box.height / 2)) * strength
    gsap.to(el, { x, y, duration: 0.6, ease: 'power3.out' })
  }

  const onLeave = () => {
    if (!ref.current) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
  }

  return (
    <span
      ref={ref}
      className={className}
      data-cursor
      style={{ display: 'inline-flex', willChange: 'transform' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </span>
  )
}
