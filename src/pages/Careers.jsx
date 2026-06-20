import '../styles/page-careers.css'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Icon3D from '../components/Icon3D.jsx'
import Magnetic from '../lib/Magnetic.jsx'

/* Real roles, verbatim from madebyanjoe.com/pages/careers. */
const ROLES = [
  {
    title: 'Operations Executive',
    tags: ['Full time', 'Mont Kiara, KL', 'Mon–Fri 10–7'],
    blurb: 'Basic salary, EPF & SOCSO. The hands that keep the studio running.',
    scope: [
      'E-commerce customer service',
      'Updating operation details into the system as required',
      'Processing orders, QC and parcel packing',
      'Inventory stock counting and warehouse arrangement',
    ],
    needs: [
      'Passionate about the health & beauty line',
      'Speaks and writes well in English & Mandarin',
      'Responsible, meticulous, good working attitude',
      'Works independently with minimum supervision',
      'Proficient in Excel, Canva and Microsoft Word',
    ],
  },
  {
    title: 'Parcel Packer / Warehouse Assistant',
    tags: ['Full time', 'Mont Kiara, KL'],
    blurb: 'The care behind every parcel that leaves our door.',
    scope: [
      'Processing online orders',
      'QC of products and parcel packing',
      'Comfortable with focused, repetitive work',
      'Maintaining consistent quality control',
    ],
    needs: ['Precision and attention to detail', 'A steady, reliable presence'],
  },
]

/* Why-us layer — framed from the real careers brief (open to interns & fresh
   grads, health/beauty studio, doing small things well). No invented perks. */
const VALUES = [
  {
    icon: 'seedling',
    title: 'Room to grow',
    body: 'We welcome interns and fresh graduates. The right attitude matters more here than a long résumé.',
  },
  {
    icon: 'herb',
    title: 'Plant-based at heart',
    body: 'A probiotic, plant-based skincare house. You’ll work close to a line built on health and clean formulation.',
  },
  {
    icon: 'sparkles',
    title: 'The small things, done well',
    body: 'From a packed parcel to a customer reply — we care about the details most people overlook.',
  },
]

const APPLY = 'mailto:hello@madebyanjoe.com?subject=Careers%20%E2%80%94%20Application'

/* Signature "culture creed" — repeated as a slow frosted ticker. Drawn straight
   from the real brief: plant-based / probiotic house, small things done well,
   interns welcome. No invented perks, no fabricated benefits. */
const CREED = [
  'Plant-based at heart',
  'The small things, done well',
  'Interns & fresh grads welcome',
  'Probiotic skincare house',
  'Mont Kiara studio',
]

export default function Careers() {
  const rolesRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const depth = parseFloat(el.dataset.parallax) || 0.12
        gsap.to(el, {
          yPercent: -depth * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('[data-parallax-scope]') || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }, rolesRef)
    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rolesRef}>
      {/* ---------- HERO ---------- */}
      <header className="page-hero page-hero--tall cr-hero" data-parallax-scope>
        <div className="page-hero__wash" />
        <span className="cr-hero__rail" aria-hidden="true">
          <span className="cr-hero__rail-co">3°09′N&nbsp;101°39′E</span>
          <span className="cr-hero__rail-rule" />
          Mont&nbsp;Kiara · KL
        </span>
        <span className="cr-hero__ghost" aria-hidden="true" data-parallax="0.16">
          Now hiring
        </span>

        <div className="container cr-hero__inner">
          <div className="cr-hero__meta" aria-hidden="true">
            <span className="cr-hero__meta-mark">Raw&nbsp;Beauté</span>
            <span className="cr-hero__tally">
              Open roles
              <em>{String(ROLES.length).padStart(2, '0')}</em>
            </span>
          </div>
          <span className="eyebrow">Careers</span>
          <h1 className="cr-hero__title">
            Build the <em>ritual</em> with us.
          </h1>
          <p className="lede cr-hero__lede">
            We’re a plant-based, probiotic skincare house in Mont Kiara, Kuala
            Lumpur. We welcome people — interns and fresh graduates included —
            who care about health, beauty and doing the small things well.
          </p>
          <ul className="cr-hero__trust" aria-hidden="true">
            <li>Full time</li>
            <li>Mont Kiara studio</li>
            <li>Interns welcome</li>
          </ul>
        </div>
      </header>

      {/* ---------- WHY US / VALUES ---------- */}
      <section className="section container cr-why">
        <div className="cr-why__head">
          <span className="eyebrow">Why join</span>
          <h2 className="cr-why__title">
            A studio that values <em>care</em>.
          </h2>
        </div>
        <div className="cr-why__grid">
          {VALUES.map((v, i) => (
            <article className="cr-value glass reveal" key={v.title}>
              <span className="cr-value__idx" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
                <span className="cr-value__idx-rule" />
              </span>
              <Icon3D name={v.icon} className="cr-value__icon" />
              <h3 className="cr-value__title">{v.title}</h3>
              <p className="cr-value__body">{v.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- SIGNATURE: CULTURE CREED TICKER ---------- */}
      <section className="cr-creed" aria-label="What we value">
        <div className="cr-creed__glass glass">
          <span className="cr-creed__label" aria-hidden="true">
            Our&nbsp;creed
          </span>
          <div className="cr-creed__viewport">
            <div className="cr-creed__track" aria-hidden="true">
              {[0, 1].map((dup) => (
                <div className="cr-creed__set" key={dup}>
                  {CREED.map((line) => (
                    <span className="cr-creed__item" key={line}>
                      <span className="cr-creed__seed" />
                      {line}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- OPEN POSITIONS ---------- */}
      <section className="band cr-roles-band">
        <div className="section container">
          <div className="cr-roles__head">
            <div className="sec-head reveal">
              <span className="eyebrow">Open positions</span>
              <h2>Find a job you love.</h2>
            </div>
            <p className="cr-roles__intro reveal">
              Two roles, both based in our Mont Kiara studio. Read the scope, then
              apply by email — we read every application.
            </p>
          </div>

          <div className="cr-roles">
            {ROLES.map((r, i) => (
              <article
                className={`cr-job reveal ${i % 2 ? 'cr-job--right' : 'cr-job--left'}`}
                key={r.title}
              >
                <span className="cr-job__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="cr-job__body glass glass--strong">
                  <div className="cr-job__top">
                    <h3 className="cr-job__title">{r.title}</h3>
                    <div className="cr-job__meta">
                      {r.tags.map((t) => (
                        <span className="chip" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="cr-job__blurb">{r.blurb}</p>

                  <div className="cr-job__cols">
                    <div className="cr-job__col">
                      <h4 className="cr-job__sub">What you’ll do</h4>
                      <ul className="cr-job__list">
                        {r.scope.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    {r.needs.length > 0 && (
                      <div className="cr-job__col">
                        <h4 className="cr-job__sub">What we’re after</h4>
                        <ul className="cr-job__list">
                          {r.needs.map((n) => (
                            <li key={n}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <a
                    className="textlink cr-job__apply"
                    href={`mailto:hello@madebyanjoe.com?subject=${encodeURIComponent(
                      'Application — ' + r.title
                    )}`}
                  >
                    Apply for this role →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW TO APPLY ---------- */}
      <section className="section container cr-apply" data-parallax-scope>
        <span className="cr-apply__seed" aria-hidden="true" data-parallax="0.1">
          <Icon3D name="seedling" className="cr-apply__seed-icon" />
        </span>
        <div className="cr-apply__inner">
          <div className="sec-head reveal">
            <span className="eyebrow">How to apply</span>
            <h2>Tell us your story.</h2>
          </div>
          <p className="lede cr-apply__lede reveal">
            We welcome interns and fresh graduates. Email your latest resume to{' '}
            <a className="textlink textlink--inline" href={APPLY}>
              hello@madebyanjoe.com
            </a>{' '}
            with your full name and date of birth, your availability, and your
            salary expectations. Only shortlisted candidates will be contacted —
            but we read every application.
          </p>
          <ol className="cr-apply__steps glass reveal" aria-label="How to apply">
            <li>
              <span className="cr-apply__step-n">01</span>
              <span className="cr-apply__step-t">
                Email your latest resume with full name and date of birth.
              </span>
            </li>
            <li>
              <span className="cr-apply__step-n">02</span>
              <span className="cr-apply__step-t">
                Tell us your availability and salary expectations.
              </span>
            </li>
            <li>
              <span className="cr-apply__step-n">03</span>
              <span className="cr-apply__step-t">
                We read every application; shortlisted candidates are contacted.
              </span>
            </li>
          </ol>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="cta">
        <div className="container cta__inner reveal">
          <h2>Don’t see your role?</h2>
          <p className="lede">Tell us how you’d help — we’re always listening.</p>
          <Magnetic>
            <a className="btn btn--light" href={APPLY}>
              Email your resume
            </a>
          </Magnetic>
        </div>
      </section>
    </div>
  )
}
