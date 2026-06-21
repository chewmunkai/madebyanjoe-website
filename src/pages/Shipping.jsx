import '../styles/page-shipping.css'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Icon3D from '../components/Icon3D.jsx'
import Magnetic from '../lib/Magnetic.jsx'

/* Shipping & returns. Bespoke design stays in code; the hero copy, the zoned rate
   card, and the returns policies are prop-driven (editable in /studio). Defaults =
   the current page. The three dispatch "fact" headlines (typographic) and the
   great-circle globe are design, kept in code. */
export const DEFAULT_ZONES = [
  {
    idx: '01', key: 'home', title: 'Home ground — Malaysia', range: 'RM7 – RM16', band: '3–10 working days',
    rows: [
      { region: 'West Malaysia', rate: 'RM7', eta: '3–4 working days' },
      { region: 'East Malaysia', rate: 'RM16', eta: '7–10 working days' },
    ],
  },
  {
    idx: '02', key: 'mid', title: 'The near region — Asia', range: 'RM40 – RM120', band: '7–14 working days',
    rows: [
      { region: 'Singapore', rate: 'RM40', eta: '7 working days' },
      { region: 'China', rate: 'RM50', eta: '7–14 working days' },
      { region: 'Hong Kong', rate: 'RM50', eta: '7–14 working days' },
      { region: 'Taiwan', rate: 'RM50', eta: '7–14 working days' },
      { region: 'Indonesia', rate: 'RM100', eta: '7–14 working days' },
      { region: 'Brunei', rate: 'RM105', eta: '7–14 working days' },
      { region: 'India', rate: 'RM120', eta: '7–14 working days' },
      { region: 'Philippines', rate: 'RM120', eta: '7–14 working days' },
    ],
  },
  {
    idx: '03', key: 'far', title: 'The long haul — worldwide', range: 'RM120 – RM175', band: '7–14 working days',
    rows: [
      { region: 'United States', rate: 'RM130', eta: '7–14 working days' },
      { region: 'Canada', rate: 'RM130', eta: '7–14 working days' },
      { region: 'United Kingdom', rate: 'RM150', eta: '7–14 working days' },
      { region: 'Australia', rate: 'RM175', eta: '7–14 working days' },
      { region: 'New Zealand', rate: 'RM175', eta: '7–14 working days' },
    ],
  },
]

/* Typographic dispatch headlines — design, kept in code. */
const FACTS = [
  { idx: 'Origin', icon: 'seedling', big: (<>Kuala Lumpur,<br /><em>Malaysia</em></>), p: 'Every order leaves our lab in KL — hand-checked before it travels.' },
  { idx: 'Dispatch', icon: 'test-tube', big: (<>Prepared in <em>1–2</em><br />business days</>), p: 'A short preparation window before your parcel is handed to the carrier.' },
  { idx: 'Carrier', icon: 'shield', big: (<>Carried by<br /><em>GDEX</em> Express</>), p: 'Tracked door-to-door, from West Malaysia to fifteen destinations.' },
]

export const DEFAULT_POLICIES = [
  { q: 'Returns & refunds', a: 'For hygiene and safety reasons, goods sold are not refundable. If you receive a wrong or defective item, please contact us so we can make it right.' },
  { q: 'Exchanges', a: 'Wrong or defective items may be exchanged within 2 weeks of receipt. Personal-hygiene items such as body brushes cannot be returned once delivery has been accepted.' },
  { q: 'Damaged on arrival', a: 'If your parcel arrives damaged, record an unboxing video and submit four (4) clear photos within 48 hours of receipt so we can process your claim.' },
  { q: 'Customs & duties', a: 'Destination countries may levy taxes or duties on your order, which the receiver is responsible for. We’re not responsible for unpaid customs taxes and can’t refund orders returned due to customs issues. Please check your country’s policies before ordering.' },
  { q: 'Failed or returned delivery', a: 'We’re not responsible for packages returned due to factors outside our control — recipient absence, customs, an incorrect address, etc. Re-delivery may incur additional shipping charges.' },
]

export default function Shipping({
  heroRail = 'Shipped worldwide · GDEX Express',
  heroCoord = '3.1390° N',
  eyebrow = 'Shipping & returns',
  titleA = 'From KL to ',
  titleEm = 'your door',
  titleB = '.',
  lede = 'Shipped from Kuala Lumpur via GDEX Express. Orders are prepared within 1–2 business days — here are the rates, timelines and our returns policy in full.',
  ratesEyebrow = 'Shipping rates',
  ratesTitleA = 'Where we ',
  ratesTitleEm = 'deliver',
  ratesTitleB = '.',
  ratesNote = 'Grouped by region, in MYR — fifteen destinations, three zones.',
  ratesFoot = 'Rates in MYR. Delivery estimates exclude the 1–2 business-day preparation window and any customs clearance.',
  zones = DEFAULT_ZONES,
  policiesEyebrow = 'Returns & policies',
  policiesTitleA = 'The fine ',
  policiesTitleEm = 'print',
  policiesTitleB = '.',
  policiesLede = 'The details worth reading before you order — hygiene, exchanges, damaged parcels, customs and returned deliveries, in full.',
  policies = DEFAULT_POLICIES,
  ctaTitle = 'Questions about a delivery?',
  ctaLede = 'Reach the team at hello@madebyanjoe.com.',
  email = 'hello@madebyanjoe.com',
} = {}) {
  const root = useRef(null)
  const zoneList = Array.isArray(zones) && zones.length ? zones : DEFAULT_ZONES
  const policyList = Array.isArray(policies) && policies.length ? policies : DEFAULT_POLICIES

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !root.current) return

    const ctx = gsap.context(() => {
      const coord = root.current.querySelector('.shipx-hero__coord')
      if (coord) {
        gsap.to(coord, { yPercent: -22, ease: 'none', scrollTrigger: { trigger: '.shipx-hero', start: 'top top', end: 'bottom top', scrub: true } })
      }
      gsap.utils.toArray('.shipx-fact').forEach((el, i) => {
        gsap.from(el, { y: 40 + i * 12, opacity: 0, ease: 'power3.out', duration: 1, scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
    }, root)

    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [])

  return (
    <div className="shipx" ref={root}>
      <header className="page-hero page-hero--tall shipx-hero">
        <div className="page-hero__wash" />
        <span className="shipx-hero__rail">{heroRail}</span>
        <p className="shipx-hero__coord" aria-hidden="true">
          {heroCoord}
        </p>
        <div className="container">
          <span className="shipx-eyebrow">
            <span className="shipx-eyebrow__mark" aria-hidden="true" />
            {eyebrow}
          </span>
          <h1>
            {titleA}<em>{titleEm}</em>{titleB}
          </h1>
          <p className="lede">{lede}</p>
          <div className="shipx-hero__route">
            <span className="shipx-hero__node">
              <b>Kuala Lumpur</b>
              <small aria-hidden="true">3.14° N · 101.69° E</small>
            </span>
            <span className="shipx-hero__route-line" aria-hidden="true">
              <span className="shipx-hero__route-dot" />
            </span>
            <span className="shipx-hero__node shipx-hero__node--end">
              <b>15 destinations</b>
              <small aria-hidden="true">worldwide</small>
            </span>
          </div>
        </div>
      </header>

      {/* DISPATCH FACTS — typographic headlines (design, in code) */}
      <section className="section container">
        <div className="shipx-facts">
          {FACTS.map((f, i) => (
            <article className="shipx-fact glass" key={f.idx}>
              <span className="shipx-fact__step" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <Icon3D name={f.icon} className="shipx-fact__ic" />
              <span className="shipx-fact__idx">{f.idx}</span>
              <h3 className="shipx-fact__big">{f.big}</h3>
              <p>{f.p}</p>
            </article>
          ))}
        </div>
      </section>

      {/* RATES — zone-grouped elevated surfaces */}
      <section className="band">
        <div className="section container">
          <div className="shipx-rates-head reveal">
            <div>
              <span className="shipx-eyebrow">
                <span className="shipx-eyebrow__mark" aria-hidden="true" />
                {ratesEyebrow}
              </span>
              <h2>
                {ratesTitleA}<em>{ratesTitleEm}</em>{ratesTitleB}
              </h2>
            </div>
            <p className="shipx-rates-head__note">{ratesNote}</p>
          </div>

          <div className="shipx-zones">
            {zoneList.map((zone) => (
              <article className={`shipx-zone shipx-zone--${zone.key} glass reveal`} key={zone.key} aria-label={`${zone.title} rates`}>
                <div className="shipx-zone__head">
                  <span className="shipx-zone__idx" aria-hidden="true">
                    <b>{zone.idx}</b>
                    <i>/ 03</i>
                  </span>
                  <span className="shipx-zone__count">
                    {zone.rows.length}{' '}
                    {zone.rows.length === 1 ? 'destination' : 'destinations'}
                  </span>
                  <h3 className="shipx-zone__title">{zone.title}</h3>
                  <div className="shipx-zone__meta">
                    <span>
                      From <span className="shipx-zone__from">{zone.range}</span>
                    </span>
                    <span className="shipx-zone__sep" aria-hidden="true" />
                    <span>{zone.band}</span>
                  </div>
                </div>

                <div className="shipx-grid" role="table" aria-label={zone.title}>
                  <div className="shipx-row shipx-row__head" role="row">
                    <span role="columnheader">Destination</span>
                    <span role="columnheader" className="shipx-cell--rate">
                      Rate
                    </span>
                    <span role="columnheader">Estimated delivery</span>
                  </div>
                  {zone.rows.map((r) => (
                    <div className="shipx-row" role="row" key={r.region}>
                      <span className="shipx-cell shipx-cell--dest" role="cell">
                        {r.region}
                      </span>
                      <span className="shipx-cell shipx-cell--rate" role="cell">
                        {r.rate}
                      </span>
                      <span className="shipx-cell shipx-cell--eta" role="cell">
                        {r.eta}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <p className="shipx-rates__foot">{ratesFoot}</p>
        </div>
      </section>

      {/* SIGNATURE great-circle globe — decorative SVG, kept in code */}
      <section className="section container">
        <figure className="shipx-globe glass reveal" aria-hidden="true">
          <figcaption className="shipx-globe__cap">
            <span className="shipx-globe__kicker">3.1390° N · 101.6869° E</span>
            <span className="shipx-globe__title">Kuala Lumpur to the world</span>
          </figcaption>
          <svg className="shipx-globe__svg" viewBox="0 0 800 360" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Great-circle routes radiating from Kuala Lumpur to fifteen destinations across the globe">
            <g className="shipx-globe__grid">
              <path d="M40 180 H760" />
              <path d="M40 110 H760" />
              <path d="M40 250 H760" />
              <path d="M260 30 V330" />
              <path d="M520 30 V330" />
            </g>
            <g className="shipx-globe__routes">
              <path className="shipx-arc" d="M560 196 Q 470 70 250 96" />
              <path className="shipx-arc" d="M560 196 Q 520 250 360 268" />
              <path className="shipx-arc" d="M560 196 Q 660 80 720 132" />
              <path className="shipx-arc" d="M560 196 Q 410 120 140 150" />
              <path className="shipx-arc" d="M560 196 Q 600 300 480 318" />
              <path className="shipx-arc" d="M560 196 Q 690 220 700 286" />
            </g>
            <g className="shipx-globe__dests">
              <circle cx="250" cy="96" r="3" />
              <circle cx="360" cy="268" r="3" />
              <circle cx="720" cy="132" r="3" />
              <circle cx="140" cy="150" r="3" />
              <circle cx="480" cy="318" r="3" />
              <circle cx="700" cy="286" r="3" />
            </g>
            <g className="shipx-globe__origin">
              <circle className="shipx-origin-pulse" cx="560" cy="196" r="6" />
              <circle className="shipx-origin-dot" cx="560" cy="196" r="4.5" />
            </g>
            <circle className="shipx-globe__traveler" r="3.2">
              <animateMotion dur="4.5s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.78;1" calcMode="spline" keySplines="0.16 1 0.3 1;0 0 1 1" path="M560 196 Q 470 70 250 96" />
            </circle>
          </svg>
        </figure>
      </section>

      {/* POLICIES — two-column editorial, depth accordions */}
      <section className="section container">
        <div className="shipx-policies__grid">
          <aside className="shipx-policies__aside reveal">
            <svg className="shipx-policies__mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
              <circle cx="32" cy="32" r="30" className="shipx-mark__ring" />
              <circle cx="32" cy="32" r="22" className="shipx-mark__ring shipx-mark__ring--in" />
              <path d="M32 6 L37 32 L32 58 L27 32 Z" className="shipx-mark__needle" />
              <path d="M6 32 L58 32" className="shipx-mark__cross" />
              <circle cx="32" cy="32" r="2.4" className="shipx-mark__hub" />
            </svg>
            <span className="shipx-eyebrow">
              <span className="shipx-eyebrow__mark" aria-hidden="true" />
              {policiesEyebrow}
            </span>
            <h2>
              {policiesTitleA}<em>{policiesTitleEm}</em>{policiesTitleB}
            </h2>
            <p>{policiesLede}</p>
          </aside>

          <div className="shipx-acc reveal">
            {policyList.map((p, i) => (
              <details className="glass" key={p.q}>
                <summary>
                  <span>
                    <span className="shipx-acc__idx">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {p.q}
                  </span>
                </summary>
                <p>{p.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta__inner reveal">
          <h2>{ctaTitle}</h2>
          <p className="lede">{ctaLede}</p>
          <div className="cta__row">
            <Magnetic>
              <a className="btn btn--light" href={`mailto:${email}`}>
                Email us
              </a>
            </Magnetic>
            <Link className="textlink textlink--ondark" to="/faq">
              Read the FAQ →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
