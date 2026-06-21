import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCatalog } from '../store/catalog.js'

/* "Dive-In" ingredient scrollytelling — a sticky stage scrubbed by scroll. Each
   chapter cross-fades to a different product photo as you swipe through the ritual.
   Pure CSS sticky + GSAP ScrollTrigger scrub (no pin) so it plays nicely with Lenis.
   Reduced motion falls back to a plain stacked layout. Heading, CTA AND the chapters
   (which product each scroll-step reveals + its copy) are editable in /studio. */
const DEFAULT_CHAPTERS = [
  { i: '01', t: 'Probiotic ferment', d: 'Turmeric and rice ferment feed the skin’s own microbiome — calming reactivity at the source, not masking it.', slug: 'probiotic-amino-cleanser' },
  { i: '02', t: 'Amino matrix', d: 'A low-pH amino-acid system cleanses and conditions in one step, never stripping the acid mantle that holds water in.', slug: 'essence-water' },
  { i: '03', t: 'Barrier lipids', d: 'Ceramides and cold-pressed plant oils reseal the wall — the difference between water sitting on skin and water staying in it.', slug: 'barrier-repair-cream' },
  { i: '04', t: 'The dewy finish', d: 'The result is skin that holds its own moisture: visibly dewy, measurably calmer, barrier-first by design.', slug: 'antioxidant-serum' },
]
export { DEFAULT_CHAPTERS }

export default function DiveInScience({
  eyebrow = 'Dive in — the science',
  titleA = 'What hydration ',
  titleEm = 'actually',
  titleB = ' needs.',
  ctaText = 'Explore the ritual →',
  ctaHref = '/shop',
  animation = 'on',
  trackVh = 440,
  chapters = DEFAULT_CHAPTERS,
} = {}) {
  const products = useCatalog((s) => s.products)
  const getProduct = (slug) => products.find((p) => p.slug === slug)
  const chapterList = Array.isArray(chapters) && chapters.length ? chapters : DEFAULT_CHAPTERS
  const root = useRef(null)
  const chapEls = useRef([])
  const imgEls = useRef([])

  useEffect(() => {
    const reduce = animation === 'off' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      root.current?.classList.add('dis--static')
      chapEls.current.forEach((el) => el?.classList.add('is-active'))
      imgEls.current[0]?.classList.add('is-active')
      return
    }
    const N = chapterList.length
    let current = -1
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          root.current.style.setProperty('--p', p.toFixed(4))
          const idx = Math.min(N - 1, Math.floor(p * N))
          if (idx !== current) {
            current = idx
            chapEls.current.forEach((el, i) => el?.classList.toggle('is-active', i === idx))
            imgEls.current.forEach((el, i) => el?.classList.toggle('is-active', i === idx))
          }
        },
      })
      return () => st.kill()
    }, root)
    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [animation, chapters, trackVh])

  return (
    <section className="dis" ref={root} style={{ '--track-vh': trackVh }}>
      <div className="dis__stage">
        <div className="dis__wash" aria-hidden="true" />

        <div className="container dis__inner">
          <div className="dis__lead">
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="dis__title">
              {titleA}
              <em>{titleEm}</em>
              {titleB}
            </h2>
          </div>

          <div className="dis__visual" aria-hidden="true">
            <span className="dis__halo" />
            {chapterList.map((c, i) => (
              <img
                key={(c.slug || '') + i}
                className="dis__shot"
                src={getProduct(c.slug)?.img}
                alt=""
                loading="lazy"
                ref={(el) => (imgEls.current[i] = el)}
              />
            ))}
          </div>

          <ol className="dis__chapters">
            {chapterList.map((c, i) => (
              <li className="dis__chapter" key={(c.i || '') + i} ref={(el) => (chapEls.current[i] = el)}>
                <span className="dis__idx">{c.i}</span>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </li>
            ))}
          </ol>

          <div className="dis__cta">
            <Link to={ctaHref} className="textlink">
              {ctaText}
            </Link>
          </div>
        </div>

        <div className="dis__progress" aria-hidden="true">
          <span className="dis__progress-fill" />
        </div>
      </div>
    </section>
  )
}
