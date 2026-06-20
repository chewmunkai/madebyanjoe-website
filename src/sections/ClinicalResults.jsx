import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* "Proof" band — big figures that count up on scroll. Every figure here is a
   verifiable brand fact (formulation, certification, founder practice, ritual),
   not a fabricated clinical percentage. */
const stats = [
  { value: 100, suffix: '%', label: 'Plant-based, botanical-first formulas' },
  { value: 0, suffix: '%', label: 'Sulfates, stripping agents or harsh fillers' },
  { value: 10, suffix: 'yr', label: 'Of pharmacist-led lymphatic-massage practice' },
  { value: 4, suffix: '', label: 'Barrier-first steps: cleanse, essence, serum, seal' },
]

export default function ClinicalResults() {
  const root = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.cr__num').forEach((el) => {
        const end = Number(el.dataset.value)
        if (reduce) {
          el.textContent = String(end)
          return
        }
        const obj = { v: 0 }
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () =>
            gsap.to(obj, {
              v: end,
              duration: 1.7,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = String(Math.round(obj.v))
              },
            }),
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="cr" ref={root}>
      <div className="container">
        <div className="cr__head">
          <span className="eyebrow">The standard</span>
          <h2 className="reveal">
            Proof, not <em>promises</em>.
          </h2>
        </div>
        <div className="cr__grid">
          {stats.map((s) => (
            <div className="cr__cell" key={s.label}>
              <div className="cr__stat">
                {s.prefix && <span className="cr__affix">{s.prefix}</span>}
                <span className="cr__num" data-value={s.value}>
                  0
                </span>
                <span className="cr__affix">{s.suffix}</span>
              </div>
              <p className="cr__label">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="cr__foot">
          Dermatologically tested · KKM-NPRA certified · Formulated in Malaysia
          under Medicircle Holding.
        </p>
      </div>
    </section>
  )
}
