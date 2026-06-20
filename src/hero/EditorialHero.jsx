import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIntro } from '../store/intro.js'
import Magnetic from '../lib/Magnetic.jsx'

/* The brand's real video as a muted, looping veil behind the hero. Set to '' to
   fall back to the type-only editorial hero. Swap the id for a different reel,
   or point at a self-hosted /video/hero.mp4 by switching to a <video> tag. */
const HERO_VIDEO_YT = 'NHoRI6BIun8'

/* Liquid Editorial hero — a giant italic-serif headline over the brand film.
   As you scroll, the film scales and deepens while the headline parallaxes and
   fades away. Reuses the shared intro store so copy rises on curtain-lift. */
export default function EditorialHero() {
  const root = useRef()
  const introDone = useIntro((s) => s.done)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.set('.eh__title .word', { yPercent: 115 })
      gsap.set(['.eh__eyebrow', '.eh__lede', '.eh__cta', '.eh__rail', '.eh__meta > *'], {
        autoAlpha: 0,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!introDone) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to('.eh__eyebrow', { autoAlpha: 1, duration: 0.6 })
        .to('.eh__title .word', { yPercent: 0, duration: 1.15, stagger: 0.13 }, '-=0.2')
        .to('.eh__lede', { autoAlpha: 1, duration: 0.8 }, '-=0.55')
        .to('.eh__cta', { autoAlpha: 1, duration: 0.8 }, '-=0.6')
        .to(['.eh__rail', '.eh__meta > *'], { autoAlpha: 1, duration: 0.8, stagger: 0.08 }, '-=0.7')
    }, root)
    return () => ctx.revert()
  }, [introDone])

  /* Scroll veil — drives --s for the film scale, scrim depth and copy parallax. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => root.current.style.setProperty('--s', self.progress.toFixed(3)),
      })
      return () => st.kill()
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className={`eh${HERO_VIDEO_YT ? ' eh--video' : ''}`} ref={root}>
      {HERO_VIDEO_YT ? (
        <div className="eh__bg" aria-hidden="true">
          <iframe
            title="ANJOE film"
            src={`https://www.youtube.com/embed/${HERO_VIDEO_YT}?autoplay=1&mute=1&loop=1&playlist=${HERO_VIDEO_YT}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&disablekb=1`}
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
        </div>
      ) : null}
      <div className="eh__wash" aria-hidden="true" />
      <div className="eh__scrim" aria-hidden="true" />

      <span className="eh__rail" aria-hidden="true">
        01 — The hydration ritual
      </span>

      <div className="eh__meta container">
        <span>Raw Beauté</span>
        <span>Est. 2020 · Kuala Lumpur</span>
      </div>

      <div className="container eh__grid">
        <div className="eh__copy">
          <span className="eyebrow eh__eyebrow">Plant-based · Probiotic · Barrier-first</span>
          <h1 className="eh__title">
            <span className="line">
              <span className="word">Hydration,</span>
            </span>
            <span className="line">
              <span className="word">
                <em>engineered.</em>
              </span>
            </span>
          </h1>
          <p className="lede eh__lede">
            Plant-based, probiotic skincare that floods the skin with moisture and
            rebuilds the barrier — clinically gentle, visibly dewy.
          </p>
          <div className="eh__cta">
            <Magnetic>
              <Link to="/shop" className="btn">
                Shop the ritual
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link to="/about" className="textlink">
                Our science →
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="eh__scroll" aria-hidden="true">
        <span className="eh__scroll-line" />
        Scroll
      </div>
    </section>
  )
}
