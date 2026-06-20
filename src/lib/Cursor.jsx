import { useEffect, useRef } from 'react'

/* Adaptive blend-mode cursor: a dot that tracks 1:1 and a ring that lags with
   easing and swells over interactive targets. Desktop pointers only; touch and
   reduced-motion users keep the native cursor. */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const html = document.documentElement
    html.classList.add('has-cursor')

    const d = dot.current
    const r = ring.current
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = 0

    const place = (el, x, y) => {
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
    }

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      place(d, mx, my)
      if (reduce) place(r, mx, my)
    }

    const loop = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      place(r, rx, ry)
      raf = requestAnimationFrame(loop)
    }
    if (!reduce) {
      place(d, mx, my)
      place(r, mx, my)
      raf = requestAnimationFrame(loop)
    }

    const over = (e) => {
      const hit = e.target.closest('a, button, [data-cursor], input, summary')
      html.classList.toggle('cursor-hover', !!hit)
    }
    const down = () => html.classList.add('cursor-down')
    const up = () => html.classList.remove('cursor-down')
    const leave = () => html.classList.add('cursor-out')
    const enter = () => html.classList.remove('cursor-out')

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', over)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
      html.classList.remove('has-cursor', 'cursor-hover', 'cursor-down', 'cursor-out')
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true" />
    </>
  )
}
