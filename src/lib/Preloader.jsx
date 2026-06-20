import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useIntro } from '../store/intro.js'

const BRAND = 'ANJOE'

/* Cinematic intro: a counter ticks 000 -> 100 while the wordmark masks in,
   then the whole panel lifts like a curtain to reveal the hero. Runs once on
   first mount. Reduced-motion users skip straight to the site. */
export default function Preloader() {
  const root = useRef(null)
  const countRef = useRef(null)
  const finish = useIntro((s) => s.finish)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const html = document.documentElement
    html.classList.add('is-loading')

    let done = false
    const end = () => {
      if (done) return
      done = true
      html.classList.remove('is-loading')
      window.__lenis?.start()
      finish()
      setHidden(true)
    }

    if (reduce) {
      end()
      return
    }

    // Hold scroll while the intro plays.
    requestAnimationFrame(() => window.__lenis?.stop())

    // Failsafe: never trap the user behind the curtain if GSAP hiccups.
    const failsafe = setTimeout(end, 5200)

    const ctx = gsap.context(() => {
      const counter = { v: 0 }
      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          clearTimeout(failsafe)
          end()
        },
      })
      tl.from('.pl__letter', { yPercent: 120, duration: 0.9, stagger: 0.06, ease: 'power4.out' }, 0)
        .to(
          counter,
          {
            v: 100,
            duration: 1.9,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (countRef.current)
                countRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
            },
          },
          0
        )
        .to('.pl__bar-fill', { scaleX: 1, duration: 1.9, ease: 'power2.inOut' }, 0)
        .to('.pl__letter', { yPercent: -120, duration: 0.65, stagger: 0.05, ease: 'power3.in' }, '+=0.2')
        .to('.pl__meta', { autoAlpha: 0, duration: 0.4 }, '<')
        .to(root.current, { yPercent: -100, duration: 1.05, ease: 'power4.inOut' }, '-=0.15')
    }, root)

    return () => {
      clearTimeout(failsafe)
      ctx.revert()
    }
  }, [finish])

  if (hidden) return null

  return (
    <div className="pl" ref={root} aria-hidden="true">
      <div className="pl__brand">
        {BRAND.split('').map((c, i) => (
          <span className="pl__letter-wrap" key={i}>
            <span className="pl__letter">{c}</span>
          </span>
        ))}
      </div>
      <div className="pl__meta">
        <span className="pl__count" ref={countRef}>
          000
        </span>
        <span className="pl__tag">Raw Beauté — hydration, engineered</span>
      </div>
      <div className="pl__bar">
        <span className="pl__bar-fill" />
      </div>
    </div>
  )
}
