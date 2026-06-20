import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* Hydration "proof" band — big figures that count up on scroll. Numbers are
   representative placeholders; swap in real clinical data when available. */
const stats = [
  { value: 128, prefix: '+', suffix: '%', label: 'Skin moisture, one hour after use' },
  { value: 94, suffix: '%', label: 'Saw a stronger barrier in four weeks' },
  { value: 8, suffix: 'h', label: 'Continuous hydration, locked in' },
  { value: 0, suffix: '%', label: 'Stripping, sulfates or harsh fillers' },
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
          <span className="eyebrow">The proof</span>
          <h2 className="reveal">
            Hydration you can <em>measure</em>.
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
          *Representative consumer-study figures — replace with your verified clinical data.
        </p>
      </div>
    </section>
  )
}
