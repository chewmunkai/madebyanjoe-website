import { useState, useEffect, useRef } from 'react'

/* Reviews — the brand's real customer testimonials, shown as received: the
   screenshot itself is the review (no transcription). Served straight from the
   live store's CDN. Presented as a slider with a thumbnail preview bar so each
   message can be read large, one at a time. */
const BASE = 'https://img.appolous.com/themes/_store/anjoe/testimonials/'
const ids = [
  8, 30, 65, 68, 85, 91, 93, 94, 95, 96, 103, 2, 6, 12, 15, 23, 32, 40, 50, 54, 88,
]

export default function Reviews() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const thumbsRef = useRef(null)
  const n = ids.length

  const go = (i) => setActive(((i % n) + n) % n)

  // gentle autoplay (respects reduced motion, pauses on hover/focus)
  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setActive((a) => (a + 1) % n), 5200)
    return () => clearInterval(t)
  }, [paused, n])

  // keep the active thumbnail centered — scroll only the strip horizontally,
  // never the page (scrollIntoView would yank the whole viewport).
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
        <span className="eyebrow">What you’re saying</span>
        <div className="rv__head-row">
          <h2 className="reveal">Real words, real skin.</h2>
          <span className="rv__sub">Unedited messages from the ANJOE community.</span>
        </div>
      </div>

      <div className="container rv__slider">
        <button className="rv__arrow rv__arrow--prev" onClick={() => go(active - 1)} aria-label="Previous review">
          ←
        </button>
        <div className="rv__stage">
          <img
            key={ids[active]}
            className="rv__active"
            src={`${BASE}${ids[active]}.webp`}
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
          {ids.map((id, i) => (
            <button
              key={id}
              className={`rv__thumb${i === active ? ' is-active' : ''}`}
              onClick={() => go(i)}
              aria-label={`View review ${i + 1}`}
              aria-current={i === active}
            >
              <img src={`${BASE}${id}.webp`} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
