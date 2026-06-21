import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIntro } from '../store/intro.js'
import Magnetic from '../lib/Magnetic.jsx'

/* The brand's real video as a muted, looping veil behind the hero. Set to '' to
   fall back to the type-only editorial hero. */
const HERO_VIDEO_YT = 'NHoRI6BIun8'

/* Liquid Editorial hero. Copy is now prop-driven (editable in /studio) with the
   current site copy as defaults. `motionless` skips the GSAP intro/scroll work and
   renders the copy visible — used inside the visual editor (where the intro never
   fires, so the copy would otherwise stay hidden). The live homepage passes nothing,
   so the full animation runs exactly as before. */
export default function EditorialHero({
  rail = '01 — The hydration ritual',
  titleLine1 = 'Hydration,',
  titleLine2 = 'engineered.',
  lede = 'Plant-based, probiotic skincare that floods the skin with moisture and rebuilds the barrier — clinically gentle, visibly dewy.',
  ctaPrimary = 'Shop the ritual',
  ctaSecondary = 'Our science →',
  motionless = false,
} = {}) {
  const root = useRef()
  const introDone = useIntro((s) => s.done)
  const animate = !motionless

  useEffect(() => {
    if (!animate) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.set('.eh__title .word', { yPercent: 115 })
      gsap.set(['.eh__lede', '.eh__cta', '.eh__trust', '.eh__rail'], { autoAlpha: 0 })
    }, root)
    return () => ctx.revert()
  }, [animate])

  useEffect(() => {
    if (!animate || !introDone) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to('.eh__title .word', { yPercent: 0, duration: 1.15, stagger: 0.13 })
        .to('.eh__lede', { autoAlpha: 1, duration: 0.8 }, '-=0.55')
        .to('.eh__cta', { autoAlpha: 1, duration: 0.8 }, '-=0.6')
        .to('.eh__trust', { autoAlpha: 1, duration: 0.8 }, '-=0.5')
        .to('.eh__rail', { autoAlpha: 1, duration: 0.8 }, '-=0.7')
    }, root)
    return () => ctx.revert()
  }, [introDone, animate])

  useEffect(() => {
    if (!animate) return
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
  }, [animate])

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
        {rail}
      </span>

      <div className="container eh__grid">
        <div className="eh__copy">
          <h1 className="eh__title">
            <span className="line">
              <span className="word">{titleLine1}</span>
            </span>
            <span className="line">
              <span className="word">
                <em>{titleLine2}</em>
              </span>
            </span>
          </h1>
          <p className="lede eh__lede">{lede}</p>
          <div className="eh__cta">
            <Magnetic>
              <Link to="/shop" className="btn">
                {ctaPrimary}
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link to="/about" className="textlink">
                {ctaSecondary}
              </Link>
            </Magnetic>
          </div>
          <ul className="eh__trust" aria-label="Why ANJOE">
            <li>Pharmacist-founded</li>
            <li>KKM-NPRA certified</li>
            <li>Dermatologically tested</li>
            <li>Ships worldwide from RM7</li>
          </ul>
        </div>
      </div>

      <div className="eh__scroll" aria-hidden="true">
        <span className="eh__scroll-line" />
        Scroll
      </div>
    </section>
  )
}
