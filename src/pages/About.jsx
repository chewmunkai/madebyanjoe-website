import '../styles/page-about.css'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PressBar from '../sections/PressBar.jsx'
import Icon3D from '../components/Icon3D.jsx'
import Magnetic from '../lib/Magnetic.jsx'

const method = [
  [
    '01',
    'Low-pH systems',
    'Cleansers and essences formulated around the skin’s own acid mantle — they lift the day without stripping the barrier that holds water in.',
    'droplet',
  ],
  [
    '02',
    'Botanical actives',
    'Plant actives at the core of every formula: grape seed and Vitamin E, mugwort, rice ferment and cold-pressed plant oils.',
    'herb',
  ],
  [
    '03',
    'Barrier lipids',
    'Ceramides and plant oils measured to reseal the moisture barrier — the difference between water sitting on skin and water staying in it.',
    'shield',
  ],
]

const values = [
  ['Plant-based', 'Botanical actives at the core of every formula — grape seed, Vitamin E, mugwort, rice ferment.', 'seedling'],
  ['Clinically gentle', 'Dermatologically tested and KKM-NPRA certified. Kind to reactive, sensitive skin.', 'test-tube'],
  ['Barrier-first', 'We treat the moisture barrier as the foundation of healthy, dewy skin.', 'shield'],
  ['Probiotic science', 'Ferments that work with the skin’s microbiome, not against it.', 'microbe'],
]

/* Milestone rail — framed strictly from real, public facts already on this page
   (UK-trained dual-licensed pharmacist; a decade of manual lymphatic massage;
   the range formulated and certified in Malaysia under Medicircle Holding;
   established 2020 in Kuala Lumpur; KKM-NPRA certified). No invented dates. */
const timeline = [
  {
    tag: 'The training',
    title: 'A pharmacist’s discipline',
    body: 'A UK-trained, dual-licensed pharmacist learns to read a formula the way a clinician reads a chart — evidence first, claims earned.',
    side: 'left',
    tone: 'blush',
  },
  {
    tag: 'The hands',
    title: 'A decade of touch',
    body: 'Ten years practising manual lymphatic massage — an intimate, daily study of how skin actually behaves, not how it’s marketed.',
    side: 'right',
    tone: 'sage',
  },
  {
    tag: 'Est. 2020 · Kuala Lumpur',
    title: 'The range she couldn’t find',
    body: 'Raw Beauté begins: low-pH systems, microbiome ferments and barrier lipids — the clinically gentle range that wasn’t on the shelf.',
    side: 'left',
    tone: 'blush',
  },
  {
    tag: 'The proof',
    title: 'Certified, not just claimed',
    body: 'Formulated and certified in Malaysia under Medicircle Holding — dermatologically tested and KKM-NPRA certified. Luxury that earns it.',
    side: 'right',
    tone: 'sage',
  },
]

const certs = ['KKM-NPRA Certified', 'Dermatologically Tested', '100% Plant-Based', 'Est. 2020 · Kuala Lumpur']

export default function About() {
  const root = useRef(null)

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
    }, root)
    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [])

  return (
    <div className="ab2" ref={root}>
      {/* ---------- HERO ---------- */}
      <header className="page-hero page-hero--tall ab2-hero" data-parallax-scope>
        <div className="page-hero__wash" />
        <span className="about__hero-rail" aria-hidden="true">
          Raw Beauté — Est. 2020
        </span>
        <span className="ab2-hero__ghost" aria-hidden="true" data-parallax="0.12">
          raw
        </span>
        <div className="container ab2-hero__grid">
          <div className="ab2-hero__lead">
            <div className="about__hero-meta" aria-hidden="true">
              <span>Our story</span>
              <span>Kuala Lumpur · MY</span>
            </div>
            <span className="eyebrow">Our story</span>
            <h1>
              Beauty, <em>raw</em> — and engineered.
            </h1>
          </div>

          {/* frosted intro card — the hero's signature glass surface */}
          <aside className="ab2-hero__card glass glass--strong reveal">
            <span className="ab2-hero__card-rule" aria-hidden="true" />
            <p className="lede ab2-hero__lede">
              ANJOE began with a simple belief: skin thrives when its barrier is
              respected. We pair botanical, probiotic formulas with the rigour of
              a pharmacist’s lab — clinically tested, gently made, deeply
              hydrating.
            </p>
            <ul className="ab2-hero__facts">
              <li>Pharmacist-founded</li>
              <li>Plant-based</li>
              <li>KKM-NPRA certified</li>
            </ul>
          </aside>
        </div>
      </header>

      {/* ---------- CREDENTIALS (shared with Home) ---------- */}
      <PressBar />

      {/* ---------- FOUNDER (overlapping / parallax portrait) ---------- */}
      <section className="section container ab2-founder" data-parallax-scope>
        <div className="ab2-founder__grid">
          <figure className="ab2-portrait reveal">
            <span className="ab2-portrait__num" aria-hidden="true">
              01
            </span>
            <div className="ab2-portrait__frame">
              <div className="ab2-portrait__media ab2-parallax" data-parallax="0.08">
                <img
                  src={`${import.meta.env.BASE_URL}anjoe-founder.jpg`}
                  alt="Anjoe Koh, founder of ANJOE"
                  loading="lazy"
                />
              </div>
            </div>
            <figcaption className="ab2-portrait__plate glass glass--strong">
              <span className="ab2-portrait__idx">The founder</span>
              <span className="ab2-portrait__name">Anjoe Koh</span>
              <span className="ab2-portrait__role">Pharmacist · Formulator</span>
            </figcaption>
          </figure>

          <div className="ab2-founder__body">
            <div className="ab2-founder__head reveal">
              <span className="ab2-kicker">
                <span className="ab2-kicker__rule" aria-hidden="true" />
                The founder
              </span>
              <h2>
                Created by <em>Anjoe Koh</em>.
              </h2>
            </div>
            {/* frosted story panel — copy lifts off the tonal wash on glass */}
            <div className="ab2-founder__copy glass reveal">
              <p className="lede">
                A UK-trained, dual-licensed pharmacist — and a former beauty queen —
                Anjoe spent a decade practising manual lymphatic massage before
                formulating the range she couldn’t find on the shelf.
              </p>
              <p>
                That pharmacist’s discipline runs through everything: low-pH systems
                that cleanse without stripping, ferments chosen for the microbiome,
                barrier lipids measured to reseal. Raw Beauté is clinical care that
                still feels like a ritual.
              </p>
              <p>
                Formulated and certified in Malaysia under Medicircle Holding, the
                range is dermatologically tested and KKM-NPRA certified — luxury that
                earns its claims.
              </p>
              <span className="ab2-founder__sign">
                Anjoe Koh — Kuala Lumpur
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TIMELINE (signature editorial moment) ---------- */}
      <section className="band">
        <div className="container section ab2-time">
          <div className="ab2-time__head reveal">
            <span className="ab2-kicker">
              <span className="ab2-kicker__rule" aria-hidden="true" />
              How it was made
            </span>
            <h2>
              The making of <em>Raw Beauté</em>.
            </h2>
          </div>
          <div className="ab2-time__rail" data-parallax-scope>
            <span
              className="ab2-time__progress"
              aria-hidden="true"
              data-parallax="-0.06"
            />
            {timeline.map((m, i) => (
              <article
                className={`ab2-mile ab2-mile--${m.side} ab2-mile--${m.tone} reveal`}
                key={m.title}
              >
                <span className="ab2-mile__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {m.side === 'right' && <div className="ab2-mile__spacer" aria-hidden="true" />}
                <div className="ab2-mile__card glass">
                  <span className="ab2-mile__chapter" aria-hidden="true">
                    Chapter {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="ab2-mile__year">{m.tag}</span>
                  <h3 className="ab2-mile__title">{m.title}</h3>
                  <p className="ab2-mile__body">{m.body}</p>
                  <span className="ab2-mile__meter" aria-hidden="true">
                    <span
                      className="ab2-mile__fill"
                      style={{ '--fill': `${((i + 1) / timeline.length) * 100}%` }}
                    />
                  </span>
                </div>
                {m.side === 'left' && <div className="ab2-mile__spacer" aria-hidden="true" />}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- METHOD / SCIENCE (lifted, staggered cards) ---------- */}
      <section className="section container ab2-method">
        <div className="ab2-method__head reveal">
          <span className="ab2-kicker">
            <span className="ab2-kicker__rule" aria-hidden="true" />
            The method
          </span>
          <h2>
            A pharmacist’s discipline, in <em>every bottle</em>.
          </h2>
        </div>
        <div className="ab2-method__grid">
          {method.map(([idx, head, body, icon]) => (
            <div className="ab2-mcell glass reveal" key={idx}>
              <Icon3D name={icon} className="ab2-mcell__ic" />
              <span className="ab2-mcell__idx">{idx}</span>
              <h4>{head}</h4>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- VALUES (broken two-column ledger) ---------- */}
      <section className="band">
        <div className="section container ab2-values">
          <div className="ab2-values__head reveal">
            <span className="ab2-kicker">
              <span className="ab2-kicker__rule" aria-hidden="true" />
              What we stand for
            </span>
            <h2>Four principles, no compromise.</h2>
          </div>
          <div className="ab2-values__grid">
            {values.map(([t, d, icon], i) => (
              <div className="ab2-value glass reveal" key={t}>
                <Icon3D name={icon} className="ab2-value__ic" />
                <div>
                  <span className="ab2-value__idx">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4>{t}</h4>
                  <p>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PULL-QUOTE — rebuilt Liquid Glass moment ---------- */}
      <section className="ab2-quote" aria-labelledby="ab2-quote-text">
        <div className="container">
          <figure className="ab2-quote__plate glass glass--strong reveal">
            <span className="ab2-quote__rail" aria-hidden="true" />
            <span className="ab2-quote__mark" aria-hidden="true">
              “
            </span>
            <div className="ab2-quote__body">
              <span className="ab2-quote__kicker" aria-hidden="true">
                <span className="ab2-quote__kicker-rule" />
                Our promise
              </span>
              <blockquote id="ab2-quote-text" className="ab2-quote__text">
                Skincare with the discipline of a lab and the gentleness of
                something <em>grown</em>.
              </blockquote>
              <figcaption className="ab2-quote__cite">
                <span className="ab2-quote__cite-name">Anjoe Koh</span>
                <span className="ab2-quote__cite-role">
                  Founder · Pharmacist · Kuala Lumpur
                </span>
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      {/* ---------- CERTIFICATIONS ---------- */}
      <div className="container">
        <div className="ab2-certs glass reveal">
          {certs.map((c, i) => (
            <span key={c} className="ab2-certs__item">
              <span className="ab2-certs__no" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ---------- CTA ---------- */}
      <section className="cta">
        <div className="container cta__inner reveal">
          <h2>Find your ritual.</h2>
          <p className="lede">Start with the cleanser. Build from there.</p>
          <Magnetic>
            <Link to="/shop" className="btn btn--light">
              Shop the collection
            </Link>
          </Magnetic>
        </div>
      </section>
    </div>
  )
}
