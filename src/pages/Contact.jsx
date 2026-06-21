import '../styles/page-contact.css'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Icon3D from '../components/Icon3D.jsx'
import Magnetic from '../lib/Magnetic.jsx'

/* Contact. Bespoke liquid-glass design stays in code; all copy + the contact
   details + channel tiles are prop-driven (editable in /studio). Defaults below =
   the current page, so it renders unchanged until edited. The live "studio open"
   status is still computed from the hours; only its labels are props. */
export const DEFAULT_CHANNELS = [
  { idx: '01', icon: 'seedling', label: 'The studio', title: 'Visit us in Mont Kiara', lines: ['S-20-09 Menara YNH', 'Kiara 163, Jalan Kiara', 'Mont Kiara 50480, KL'] },
  { idx: '02', icon: 'droplet', label: 'Direct line', title: 'Call or write the team', lines: ['03-2702 9531', 'hello@madebyanjoe.com'], href: 'tel:0327029531', hrefLabel: 'Call now' },
  { idx: '03', icon: 'sparkles', label: 'Studio hours', title: 'Open Monday to Friday', lines: ['10am – 7pm (UTC+8)', 'Replies within 1–2 days'] },
]

/* Derive a real "studio open now" state from the actual hours (Mon–Fri,
   10:00–19:00, Kuala Lumpur / UTC+8) — purely the published hours expressed live. */
function useStudioStatus() {
  const compute = () => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kuala_Lumpur',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date())
    const get = (t) => parts.find((p) => p.type === t)?.value
    const day = get('weekday')
    const hour = Number(get('hour'))
    const minute = Number(get('minute'))
    const mins = hour * 60 + minute
    const isWeekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day)
    const open = isWeekday && mins >= 600 && mins < 1140 // 10:00–19:00
    return { open, day, isWeekday }
  }

  const [status, setStatus] = useState(compute)
  useEffect(() => {
    const id = setInterval(() => setStatus(compute()), 60_000)
    return () => clearInterval(id)
  }, [])
  return status
}

const lines = (arr) => (Array.isArray(arr) ? arr.map((l) => (typeof l === 'string' ? l : l?.line)).filter(Boolean) : [])

export default function Contact({
  company = 'Medicircle Holding Sdn Bhd (201701030879)',
  address = 'S-20-09 Menara YNH, Kiara 163, Jalan Kiara, Mont Kiara 50480, Kuala Lumpur',
  phone = '03-2702 9531',
  email = 'hello@madebyanjoe.com',
  hours = 'Mon–Fri, 10am–7pm',
  introStamp = 'Get in touch',
  introCoord = '3.17°N 101.65°E',
  introTitleA = 'Let’s',
  introTitleEm = 'talk',
  introTitleB = ' skin.',
  introLede = 'Questions about a formula, an order, or a ritual? Reach the ANJOE team in Mont Kiara — we read every message and reply as quickly as we can.',
  statusOpenLabel = 'Studio open now',
  statusClosedLabel = 'Studio closed now',
  panelLabel = 'Send a message',
  panelTitleA = 'Write to ',
  panelTitleEm = 'us',
  sentMessage = 'Thank you — your message is on its way. We’ll reply within 1–2 business days.',
  sendButton = 'Send message',
  dossierLabel = 'The details',
  instagramUrl = 'https://www.instagram.com/madebyanjoe',
  facebookUrl = 'https://www.facebook.com/madebyanjoe',
  handle = '@madebyanjoe',
  locatorLabel = 'Find us',
  locatorTitleA = 'The studio in ',
  locatorTitleEm = 'Mont Kiara',
  locatorTitleB = '.',
  locatorLede = 'Tucked into Menara YNH at Kiara 163 — at the heart of Mont Kiara, Kuala Lumpur. Drop by during studio hours, or reach us any time by message.',
  lat = '3.1670° N',
  long = '101.6500° E',
  mapCaption = 'Menara YNH · Kiara 163',
  consoleLabel = 'Every way in',
  consoleTitleA = 'Three ways to ',
  consoleTitleEm = 'reach',
  consoleTitleB = ' us.',
  channels = DEFAULT_CHANNELS,
  ctaTitle = 'Rather just email us?',
  ctaButton = 'Email the team',
  ctaFaqLink = 'Read the FAQ →',
} = {}) {
  const [sent, setSent] = useState(false)
  const status = useStudioStatus()
  const root = useRef(null)
  const tel = `tel:${phone.replace(/[^0-9+]/g, '')}`
  const channelList = Array.isArray(channels) && channels.length ? channels : DEFAULT_CHANNELS

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !root.current) return

    const ctx = gsap.context(() => {
      const aurora = root.current.querySelector('.cx-stage__aurora')
      if (aurora) {
        gsap.to(aurora, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.cx-stage', start: 'top top', end: 'bottom top', scrub: true } })
      }
      const ghost = root.current.querySelector('.cx-stage__word')
      if (ghost) {
        gsap.to(ghost, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: '.cx-stage', start: 'top top', end: 'bottom top', scrub: true } })
      }
      const orbit = root.current.querySelector('.cx-map__orbit')
      if (orbit) {
        gsap.to(orbit, { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '.cx-locator', start: 'top bottom', end: 'bottom top', scrub: true } })
      }
      gsap.utils.toArray('.cx-tile').forEach((el, i) => {
        gsap.from(el, { y: 34 + i * 10, opacity: 0, ease: 'power3.out', duration: 0.9, scrollTrigger: { trigger: el, start: 'top 90%' } })
      })
    }, root)

    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [])

  return (
    <div className="cx" ref={root}>
      <section className="cx-stage">
        <div className="cx-stage__aurora" aria-hidden="true" />
        <div className="cx-stage__grid" aria-hidden="true" />
        <p className="cx-stage__word" aria-hidden="true">
          Bonjour
        </p>

        <div className="container cx-stage__inner">
          <div className="cx-intro">
            <span className="cx-coord-stamp">
              <span className="cx-coord-stamp__mark" aria-hidden="true" />
              <span className="cx-coord-stamp__t">{introStamp}</span>
              <span className="cx-coord-stamp__c" aria-hidden="true">
                {introCoord}
              </span>
            </span>
            <h1 className="cx-intro__title">
              {introTitleA}
              <br />
              <em>{introTitleEm}</em>{introTitleB}
            </h1>
            <p className="cx-intro__lede">{introLede}</p>
            <span className={`cx-status cx-status--${status.open ? 'open' : 'closed'} cx-intro__status`}>
              <span className="cx-status__dot" aria-hidden="true" />
              {status.open ? statusOpenLabel : statusClosedLabel}
              <span className="cx-status__sep" aria-hidden="true">·</span>
              {hours}
            </span>
          </div>

          <div className="cx-panel">
            <span className="cx-panel__refract" aria-hidden="true" />
            <span className="cx-panel__sheen" aria-hidden="true" />
            <span className="cx-panel__rim" aria-hidden="true" />

            <div className="cx-panel__body">
              <div className="cx-panel__head">
                <span className="cx-microlabel">
                  <span className="cx-microlabel__n">01</span>
                  <span className="cx-microlabel__t">{panelLabel}</span>
                </span>
                <h2 className="cx-panel__title">
                  {panelTitleA}<em>{panelTitleEm}</em>
                </h2>
              </div>

              {sent ? (
                <p className="cx-panel__ok">{sentMessage}</p>
              ) : (
                <form
                  className="cx-panel__form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSent(true)
                  }}
                >
                  <div className="cx-form__row">
                    <label className="cx-field">
                      <span className="cx-field__label">Name</span>
                      <input className="cx-field__input" type="text" name="name" required />
                    </label>
                    <label className="cx-field">
                      <span className="cx-field__label">Email</span>
                      <input className="cx-field__input" type="email" name="email" required />
                    </label>
                  </div>
                  <label className="cx-field">
                    <span className="cx-field__label">Subject</span>
                    <input className="cx-field__input" type="text" name="subject" />
                  </label>
                  <label className="cx-field">
                    <span className="cx-field__label">Message</span>
                    <textarea className="cx-field__input" name="message" rows={5} required />
                  </label>
                  <Magnetic>
                    <button className="btn cx-panel__send" type="submit">
                      {sendButton}
                    </button>
                  </Magnetic>
                  <p className="cx-panel__note">
                    Prefer email? Write to{' '}
                    <a className="textlink textlink--inline" href={`mailto:${email}`}>
                      {email}
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>

          <aside className="cx-dossier glass">
            <span className="cx-microlabel">
              <span className="cx-microlabel__n">02</span>
              <span className="cx-microlabel__t">{dossierLabel}</span>
            </span>

            <dl className="cx-dossier__list">
              <div className="cx-dossier__row">
                <dt className="cx-dossier__label">Visit</dt>
                <dd className="cx-dossier__value">{address}</dd>
              </div>
              <div className="cx-dossier__row">
                <dt className="cx-dossier__label">Call</dt>
                <dd className="cx-dossier__value">
                  <a className="cx-dossier__link" href={tel}>
                    {phone}
                  </a>
                </dd>
              </div>
              <div className="cx-dossier__row">
                <dt className="cx-dossier__label">Email</dt>
                <dd className="cx-dossier__value">
                  <a className="cx-dossier__link" href={`mailto:${email}`}>
                    {email}
                  </a>
                </dd>
              </div>
              <div className="cx-dossier__row">
                <dt className="cx-dossier__label">Hours</dt>
                <dd className="cx-dossier__value">{hours}</dd>
              </div>
            </dl>

            <div className="cx-dossier__social">
              <span className="cx-dossier__social-label">Follow</span>
              <div className="cx-dossier__social-links">
                <a className="cx-dossier__social-link" href={instagramUrl} target="_blank" rel="noreferrer">
                  Instagram <i aria-hidden="true">↗</i>
                </a>
                <a className="cx-dossier__social-link" href={facebookUrl} target="_blank" rel="noreferrer">
                  Facebook <i aria-hidden="true">↗</i>
                </a>
              </div>
              <p className="cx-dossier__handle">{handle}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="band cx-locator">
        <div className="section container cx-locator__inner">
          <div className="cx-locator__copy reveal">
            <span className="cx-microlabel">
              <span className="cx-microlabel__n">03</span>
              <span className="cx-microlabel__t">{locatorLabel}</span>
            </span>
            <h2 className="cx-locator__title">
              {locatorTitleA}<em>{locatorTitleEm}</em>{locatorTitleB}
            </h2>
            <p className="cx-locator__lede">{locatorLede}</p>
            <div className="cx-coords" aria-hidden="true">
              <span className="cx-coords__pair">
                <b>{lat}</b>
                <small>Latitude</small>
              </span>
              <span className="cx-coords__pair">
                <b>{long}</b>
                <small>Longitude</small>
              </span>
            </div>
            <address className="cx-locator__addr">{address}</address>
          </div>

          <figure className="cx-map" aria-hidden="true">
            <div className="cx-map__orbit">
              <span className="cx-map__ring cx-map__ring--1" />
              <span className="cx-map__ring cx-map__ring--2" />
              <span className="cx-map__ring cx-map__ring--3" />
            </div>
            <span className="cx-map__street cx-map__street--h" />
            <span className="cx-map__street cx-map__street--v" />
            <span className="cx-map__street cx-map__street--d" />
            <span className="cx-map__plot cx-map__plot--a" />
            <span className="cx-map__plot cx-map__plot--b" />
            <span className="cx-map__plot cx-map__plot--c" />
            <span className="cx-map__pin">
              <span className="cx-map__pulse" />
            </span>
            <span className="cx-lens">
              <span className="cx-lens__refract" />
              <span className="cx-lens__crosshair" />
            </span>
            <figcaption className="cx-map__cap">{mapCaption}</figcaption>
            <span className={`cx-map__status cx-status cx-status--${status.open ? 'open' : 'closed'}`}>
              <span className="cx-status__dot" aria-hidden="true" />
              {status.open ? 'Studio open' : 'Studio closed'}
            </span>
          </figure>
        </div>

        <svg className="cx-svg-defs" aria-hidden="true" focusable="false">
          <filter id="cx-glass-warp" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.014" numOctaves="2" seed="11" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="1.4" result="soft" />
            <feDisplacementMap in="SourceGraphic" in2="soft" scale="26" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      </section>

      <section className="cx-console">
        <div className="cx-console__field" aria-hidden="true" />
        <div className="section container cx-console__inner">
          <div className="cx-console__head reveal">
            <span className="cx-microlabel">
              <span className="cx-microlabel__n">04</span>
              <span className="cx-microlabel__t">{consoleLabel}</span>
            </span>
            <h2 className="cx-console__title">
              {consoleTitleA}<em>{consoleTitleEm}</em>{consoleTitleB}
            </h2>
          </div>
          <div className="cx-tiles">
            {channelList.map((c) => (
              <article className="cx-tile glass" key={c.idx}>
                <div className="cx-tile__top">
                  <Icon3D name={c.icon} className="cx-tile__ic" />
                  <span className="cx-tile__idx">{c.idx}</span>
                </div>
                <span className="cx-tile__label">{c.label}</span>
                <h3 className="cx-tile__title">{c.title}</h3>
                <ul className="cx-tile__lines">
                  {lines(c.lines).map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
                {c.href && (
                  <a className="cx-tile__cta" href={c.href}>
                    {c.hrefLabel} <i aria-hidden="true">→</i>
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta__inner reveal">
          <h2>{ctaTitle}</h2>
          <p className="lede">Write to {email} — we read every message.</p>
          <div className="cta__row">
            <Magnetic>
              <a className="btn btn--light" href={`mailto:${email}`}>
                {ctaButton}
              </a>
            </Magnetic>
            <Link className="textlink textlink--ondark" to="/faq">
              {ctaFaqLink}
            </Link>
          </div>
          <p className="cx-cta__legal">{company}</p>
        </div>
      </section>
    </div>
  )
}
