import { useState, useEffect, useRef } from 'react'

/* Reviews — real customer testimonials shown as received (the screenshot is the
   review). Heading copy + the testimonial images are editable in /studio: the
   images are a list you can add to / remove / reorder (upload your own screenshots
   or paste URLs). Defaults below = the current set, served from the store CDN. */
const BASE = 'https://img.appolous.com/themes/_store/anjoe/testimonials/'
const DEFAULT_IDS = [
  8, 30, 65, 68, 85, 91, 93, 94, 95, 96, 103, 2, 6, 12, 15, 23, 32, 40, 50, 54, 88,
]
const DEFAULT_TESTIMONIALS = DEFAULT_IDS.map((id) => ({ image: `${BASE}${id}.webp` }))

export default function Reviews({
  eyebrow = 'What you’re saying',
  title = 'Real words, real skin.',
  sub = 'Unedited messages from the ANJOE community.',
  reveal = 'on',
  testimonials = DEFAULT_TESTIMONIALS,
} = {}) {
  const items = (Array.isArray(testimonials) && testimonials.length ? testimonials : DEFAULT_TESTIMONIALS)
    .map((t) => (typeof t === 'string' ? t : t?.image))
    .filter(Boolean)
  const n = items.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const thumbsRef = useRef(null)

  const go = (i) => setActive(((i % n) + n) % n)

  // Keep `active` valid if the list shrinks.
  useEffect(() => {
    if (active >= n) setActive(0)
  }, [n, active])

  // gentle autoplay (respects reduced motion, pauses on hover/focus)
  useEffect(() => {
    if (paused || n <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setActive((a) => (a + 1) % n), 5200)
    return () => clearInterval(t)
  }, [paused, n])

  // keep the active thumbnail centered — scroll only the strip horizontally.
  useEffect(() => {
    const bar = thumbsRef.current
    const el = bar?.querySelector('.rv__thumb.is-active')
    if (bar && el) {
      const target = el.offsetLeft - bar.clientWidth / 2 + el.clientWidth / 2
      bar.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
    }
  }, [active])

  return (
    <section
      className="rv"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="container rv__head">
        <span className="eyebrow">{eyebrow}</span>
        <div className="rv__head-row">
          <h2 className={reveal !== 'off' ? 'reveal' : undefined}>{title}</h2>
          <span className="rv__sub">{sub}</span>
        </div>
      </div>

      <div className="container rv__slider">
        <button className="rv__arrow rv__arrow--prev" onClick={() => go(active - 1)} aria-label="Previous review">
          ←
        </button>
        <div className="rv__stage">
          <img
            key={items[active]}
            className="rv__active"
            src={items[active]}
            alt={`Customer testimonial ${active + 1} of ${n}`}
          />
        </div>
        <button className="rv__arrow rv__arrow--next" onClick={() => go(active + 1)} aria-label="Next review">
          →
        </button>
      </div>

      <div className="container rv__bar">
        <span className="rv__count" aria-hidden="true">
          {String(active + 1).padStart(2, '0')} <i>/</i> {String(n).padStart(2, '0')}
        </span>
        <div className="rv__thumbs" ref={thumbsRef}>
          {items.map((src, i) => (
            <button
              key={src + i}
              className={`rv__thumb${i === active ? ' is-active' : ''}`}
              onClick={() => go(i)}
              aria-label={`View review ${i + 1}`}
              aria-current={i === active}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
