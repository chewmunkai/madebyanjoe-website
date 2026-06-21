import '../styles/page-about.css'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PressBar from '../sections/PressBar.jsx'
import Icon3D from '../components/Icon3D.jsx'
import Magnetic from '../lib/Magnetic.jsx'

/* About / Our Story. The bespoke parallax/glass design stays in code; its COPY and
   its four lists (timeline, method, values, certifications) are prop-driven so they're
   editable in /studio. Defaults below = the current page, so it renders unchanged until
   edited. Props arrive flattened from a single "About page" editor block. */
const DEFAULT_METHOD = [
  { idx: '01', head: 'Low-pH systems', body: 'Cleansers and essences formulated around the skin’s own acid mantle — they lift the day without stripping the barrier that holds water in.', icon: 'droplet' },
  { idx: '02', head: 'Botanical actives', body: 'Plant actives at the core of every formula: grape seed and Vitamin E, mugwort, rice ferment and cold-pressed plant oils.', icon: 'herb' },
  { idx: '03', head: 'Barrier lipids', body: 'Ceramides and plant oils measured to reseal the moisture barrier — the difference between water sitting on skin and water staying in it.', icon: 'shield' },
]
const DEFAULT_VALUES = [
  { title: 'Plant-based', body: 'Botanical actives at the core of every formula — grape seed, Vitamin E, mugwort, rice ferment.', icon: 'seedling' },
  { title: 'Clinically gentle', body: 'Dermatologically tested and KKM-NPRA certified. Kind to reactive, sensitive skin.', icon: 'test-tube' },
  { title: 'Barrier-first', body: 'We treat the moisture barrier as the foundation of healthy, dewy skin.', icon: 'shield' },
  { title: 'Probiotic science', body: 'Ferments that work with the skin’s microbiome, not against it.', icon: 'microbe' },
]
const DEFAULT_TIMELINE = [
  { tag: 'The training', title: 'A pharmacist’s discipline', body: 'A UK-trained, dual-licensed pharmacist learns to read a formula the way a clinician reads a chart — evidence first, claims earned.', side: 'left', tone: 'blush' },
  { tag: 'The hands', title: 'A decade of touch', body: 'Ten years practising manual lymphatic massage — an intimate, daily study of how skin actually behaves, not how it’s marketed.', side: 'right', tone: 'sage' },
  { tag: 'Est. 2020 · Kuala Lumpur', title: 'The range she couldn’t find', body: 'Raw Beauté begins: low-pH systems, microbiome ferments and barrier lipids — the clinically gentle range that wasn’t on the shelf.', side: 'left', tone: 'blush' },
  { tag: 'The proof', title: 'Certified, not just claimed', body: 'Formulated and certified in Malaysia under Medicircle Holding — dermatologically tested and KKM-NPRA certified. Luxury that earns it.', side: 'right', tone: 'sage' },
]
const DEFAULT_CERTS = [
  { label: 'KKM-NPRA Certified' },
  { label: 'Dermatologically Tested' },
  { label: '100% Plant-Based' },
  { label: 'Est. 2020 · Kuala Lumpur' },
]
const DEFAULT_FOUNDER_COPY = [
  'A UK-trained, dual-licensed pharmacist — and a former beauty queen — Anjoe spent a decade practising manual lymphatic massage before formulating the range she couldn’t find on the shelf.',
  'That pharmacist’s discipline runs through everything: low-pH systems that cleanse without stripping, ferments chosen for the microbiome, barrier lipids measured to reseal. Raw Beauté is clinical care that still feels like a ritual.',
  'Formulated and certified in Malaysia under Medicircle Holding, the range is dermatologically tested and KKM-NPRA certified — luxury that earns its claims.',
]

const txt = (v) => (typeof v === 'string' ? v : v?.label)

export default function About({
  heroRail = 'Raw Beauté — Est. 2020',
  heroEyebrow = 'Our story',
  heroTitleA = 'Beauty, ',
  heroTitleEm = 'raw',
  heroTitleB = ' — and engineered.',
  introLede = 'ANJOE began with a simple belief: skin thrives when its barrier is respected. We pair botanical, probiotic formulas with the rigour of a pharmacist’s lab — clinically tested, gently made, deeply hydrating.',
  founderTitleA = 'Created by ',
  founderTitleEm = 'Anjoe Koh',
  founderTitleB = '.',
  founderCopy = DEFAULT_FOUNDER_COPY,
  founderSign = 'Anjoe Koh — Kuala Lumpur',
  timelineTitleA = 'The making of ',
  timelineTitleEm = 'Raw Beauté',
  timelineTitleB = '.',
  timeline = DEFAULT_TIMELINE,
  methodTitleA = 'A pharmacist’s discipline, in ',
  methodTitleEm = 'every bottle',
  methodTitleB = '.',
  method = DEFAULT_METHOD,
  valuesTitle = 'Four principles, no compromise.',
  values = DEFAULT_VALUES,
  quoteA = 'Skincare with the discipline of a lab and the gentleness of something ',
  quoteEm = 'grown',
  quoteB = '.',
  quoteName = 'Anjoe Koh',
  quoteRole = 'Founder · Pharmacist · Kuala Lumpur',
  certs = DEFAULT_CERTS,
  ctaTitle = 'Find your ritual.',
  ctaLede = 'Start with the cleanser. Build from there.',
  ctaButton = 'Shop the collection',
} = {}) {
  const root = useRef(null)
  const methodList = Array.isArray(method) && method.length ? method : DEFAULT_METHOD
  const valuesList = Array.isArray(values) && values.length ? values : DEFAULT_VALUES
  const timelineList = Array.isArray(timeline) && timeline.length ? timeline : DEFAULT_TIMELINE
  const certsList = (Array.isArray(certs) && certs.length ? certs : DEFAULT_CERTS).map(txt).filter(Boolean)
  const founderParas = (Array.isArray(founderCopy) && founderCopy.length ? founderCopy : DEFAULT_FOUNDER_COPY)
    .map((p) => (typeof p === 'string' ? p : p?.text))
    .filter(Boolean)

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
          {heroRail}
        </span>
        <span className="ab2-hero__ghost" aria-hidden="true" data-parallax="0.12">
          raw
        </span>
        <div className="container ab2-hero__grid">
          <div className="ab2-hero__lead">
            <div className="about__hero-meta" aria-hidden="true">
              <span>{heroEyebrow}</span>
              <span>Kuala Lumpur · MY</span>
            </div>
            <span className="eyebrow">{heroEyebrow}</span>
            <h1>
              {heroTitleA}
              <em>{heroTitleEm}</em>
              {heroTitleB}
            </h1>
          </div>

          {/* frosted intro card — the hero's signature glass surface */}
          <aside className="ab2-hero__card glass glass--strong reveal">
            <span className="ab2-hero__card-rule" aria-hidden="true" />
            <p className="lede ab2-hero__lede">{introLede}</p>
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
                {founderTitleA}
                <em>{founderTitleEm}</em>
                {founderTitleB}
              </h2>
            </div>
            {/* frosted story panel — copy lifts off the tonal wash on glass */}
            <div className="ab2-founder__copy glass reveal">
              {founderParas.map((p, i) => (
                <p key={i} className={i === 0 ? 'lede' : undefined}>
                  {p}
                </p>
              ))}
              <span className="ab2-founder__sign">{founderSign}</span>
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
              {timelineTitleA}
              <em>{timelineTitleEm}</em>
              {timelineTitleB}
            </h2>
          </div>
          <div className="ab2-time__rail" data-parallax-scope>
            <span
              className="ab2-time__progress"
              aria-hidden="true"
              data-parallax="-0.06"
            />
            {timelineList.map((m, i) => (
              <article
                className={`ab2-mile ab2-mile--${m.side || 'left'} ab2-mile--${m.tone || 'blush'} reveal`}
                key={(m.title || '') + i}
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
                      style={{ '--fill': `${((i + 1) / timelineList.length) * 100}%` }}
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
            {methodTitleA}
            <em>{methodTitleEm}</em>
            {methodTitleB}
          </h2>
        </div>
        <div className="ab2-method__grid">
          {methodList.map((m, i) => (
            <div className="ab2-mcell glass reveal" key={(m.idx || '') + i}>
              <Icon3D name={m.icon} className="ab2-mcell__ic" />
              <span className="ab2-mcell__idx">{m.idx}</span>
              <h4>{m.head}</h4>
              <p>{m.body}</p>
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
            <h2>{valuesTitle}</h2>
          </div>
          <div className="ab2-values__grid">
            {valuesList.map((v, i) => (
              <div className="ab2-value glass reveal" key={(v.title || '') + i}>
                <Icon3D name={v.icon} className="ab2-value__ic" />
                <div>
                  <span className="ab2-value__idx">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4>{v.title}</h4>
                  <p>{v.body}</p>
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
                {quoteA}
                <em>{quoteEm}</em>
                {quoteB}
              </blockquote>
              <figcaption className="ab2-quote__cite">
                <span className="ab2-quote__cite-name">{quoteName}</span>
                <span className="ab2-quote__cite-role">{quoteRole}</span>
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      {/* ---------- CERTIFICATIONS ---------- */}
      <div className="container">
        <div className="ab2-certs glass reveal">
          {certsList.map((c, i) => (
            <span key={c + i} className="ab2-certs__item">
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
          <h2>{ctaTitle}</h2>
          <p className="lede">{ctaLede}</p>
          <Magnetic>
            <Link to="/shop" className="btn btn--light">
              {ctaButton}
            </Link>
          </Magnetic>
        </div>
      </section>
    </div>
  )
}
