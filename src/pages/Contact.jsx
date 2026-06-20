import '../styles/page-contact.css'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Icon3D from '../components/Icon3D.jsx'
import Magnetic from '../lib/Magnetic.jsx'

/* Real, verified brand details only — sourced from madebyanjoe.com/contact. */
const INFO = {
  company: 'Medicircle Holding Sdn Bhd (201701030879)',
  address: 'S-20-09 Menara YNH, Kiara 163, Jalan Kiara, Mont Kiara 50480, Kuala Lumpur',
  phone: '03-2702 9531',
  email: 'hello@madebyanjoe.com',
  hours: 'Mon–Fri, 10am–7pm',
}

/* The contact directory, modelled as a "console" of glass channel tiles. */
const CHANNELS = [
  {
    idx: '01',
    icon: 'seedling',
    label: 'The studio',
    title: 'Visit us in Mont Kiara',
    lines: ['S-20-09 Menara YNH', 'Kiara 163, Jalan Kiara', 'Mont Kiara 50480, KL'],
  },
  {
    idx: '02',
    icon: 'droplet',
    label: 'Direct line',
    title: 'Call or write the team',
    lines: [INFO.phone, INFO.email],
    href: `tel:${INFO.phone.replace(/[^0-9+]/g, '')}`,
    hrefLabel: 'Call now',
  },
  {
    idx: '03',
    icon: 'sparkles',
    label: 'Studio hours',
    title: 'Open Monday to Friday',
    lines: ['10am – 7pm (UTC+8)', 'Replies within 1–2 days'],
  },
]

/* SIGNATURE: derive a real "studio open now" state from the actual hours
   (Mon–Fri, 10:00–19:00, Kuala Lumpur / UTC+8). No fabrication — purely the
   published hours expressed live. */
function useStudioStatus() {
  const compute = () => {
    // Convert "now" to Kuala Lumpur wall-clock regardless of viewer timezone.
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

export default function Contact() {
  const [sent, setSent] = useState(false)
  const status = useStudioStatus()
  const root = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !root.current) return

    const ctx = gsap.context(() => {
      // The aurora field drifts behind the glass for refraction depth.
      const aurora = root.current.querySelector('.cx-stage__aurora')
      if (aurora) {
        gsap.to(aurora, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.cx-stage',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // Drift the giant kerned wordmark as the stage scrolls.
      const ghost = root.current.querySelector('.cx-stage__word')
      if (ghost) {
        gsap.to(ghost, {
          xPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: '.cx-stage',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // Gentle drift on the locator contour field for depth.
      const orbit = root.current.querySelector('.cx-map__orbit')
      if (orbit) {
        gsap.to(orbit, {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: {
            trigger: '.cx-locator',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // Staggered lift on the channel console tiles.
      gsap.utils.toArray('.cx-tile').forEach((el, i) => {
        gsap.from(el, {
          y: 34 + i * 10,
          opacity: 0,
          ease: 'power3.out',
          duration: 0.9,
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })
    }, root)

    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [])

  return (
    <div className="cx" ref={root}>
      {/* ===========================================================
          THE STAGE — one tonal/gradient field on which the hero copy,
          the frosted form panel, and the contact dossier all OVERLAP.
          This single overlapping composition replaces the old
          hero + separate split section.
          =========================================================== */}
      <section className="cx-stage">
        {/* tonal background fields the glass refracts over */}
        <div className="cx-stage__aurora" aria-hidden="true" />
        <div className="cx-stage__grid" aria-hidden="true" />
        <p className="cx-stage__word" aria-hidden="true">
          Bonjour
        </p>

        <div className="container cx-stage__inner">
          {/* --- LEFT: editorial intro, set high, breaking the grid --- */}
          <div className="cx-intro">
            <span className="cx-coord-stamp">
              <span className="cx-coord-stamp__mark" aria-hidden="true" />
              <span className="cx-coord-stamp__t">Get in touch</span>
              <span className="cx-coord-stamp__c" aria-hidden="true">
                3.17°N&nbsp;101.65°E
              </span>
            </span>
            <h1 className="cx-intro__title">
              Let’s
              <br />
              <em>talk</em> skin.
            </h1>
            <p className="cx-intro__lede">
              Questions about a formula, an order, or a ritual? Reach the ANJOE
              team in Mont Kiara — we read every message and reply as quickly as
              we can.
            </p>
            <span
              className={`cx-status cx-status--${status.open ? 'open' : 'closed'} cx-intro__status`}
            >
              <span className="cx-status__dot" aria-hidden="true" />
              {status.open ? 'Studio open now' : 'Studio closed now'}
              <span className="cx-status__sep" aria-hidden="true">·</span>
              {INFO.hours}
            </span>
          </div>

          {/* --- CENTER: the signature multi-plane Liquid Glass form panel --- */}
          <div className="cx-panel">
            {/* multi-plane glass stack (re-built from the 21st.dev liquid-glass
                recipe in vanilla CSS): refraction layer + tint + specular rim,
                stacked as separate planes behind the content. */}
            <span className="cx-panel__refract" aria-hidden="true" />
            <span className="cx-panel__sheen" aria-hidden="true" />
            <span className="cx-panel__rim" aria-hidden="true" />

            <div className="cx-panel__body">
              <div className="cx-panel__head">
                <span className="cx-microlabel">
                  <span className="cx-microlabel__n">01</span>
                  <span className="cx-microlabel__t">Send a message</span>
                </span>
                <h2 className="cx-panel__title">
                  Write to <em>us</em>
                </h2>
              </div>

              {sent ? (
                <p className="cx-panel__ok">
                  Thank you — your message is on its way. We’ll reply within 1–2
                  business days.
                </p>
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
                      Send message
                    </button>
                  </Magnetic>
                  <p className="cx-panel__note">
                    Prefer email? Write to{' '}
                    <a className="textlink textlink--inline" href={`mailto:${INFO.email}`}>
                      {INFO.email}
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* --- RIGHT: a tall glass "dossier" rail, overlapping the panel --- */}
          <aside className="cx-dossier glass">
            <span className="cx-microlabel">
              <span className="cx-microlabel__n">02</span>
              <span className="cx-microlabel__t">The details</span>
            </span>

            <dl className="cx-dossier__list">
              <div className="cx-dossier__row">
                <dt className="cx-dossier__label">Visit</dt>
                <dd className="cx-dossier__value">{INFO.address}</dd>
              </div>
              <div className="cx-dossier__row">
                <dt className="cx-dossier__label">Call</dt>
                <dd className="cx-dossier__value">
                  <a className="cx-dossier__link" href={`tel:${INFO.phone.replace(/[^0-9+]/g, '')}`}>
                    {INFO.phone}
                  </a>
                </dd>
              </div>
              <div className="cx-dossier__row">
                <dt className="cx-dossier__label">Email</dt>
                <dd className="cx-dossier__value">
                  <a className="cx-dossier__link" href={`mailto:${INFO.email}`}>
                    {INFO.email}
                  </a>
                </dd>
              </div>
              <div className="cx-dossier__row">
                <dt className="cx-dossier__label">Hours</dt>
                <dd className="cx-dossier__value">{INFO.hours}</dd>
              </div>
            </dl>

            <div className="cx-dossier__social">
              <span className="cx-dossier__social-label">Follow</span>
              <div className="cx-dossier__social-links">
                <a
                  className="cx-dossier__social-link"
                  href="https://www.instagram.com/madebyanjoe"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram <i aria-hidden="true">↗</i>
                </a>
                <a
                  className="cx-dossier__social-link"
                  href="https://www.facebook.com/madebyanjoe"
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook <i aria-hidden="true">↗</i>
                </a>
              </div>
              <p className="cx-dossier__handle">@madebyanjoe</p>
            </div>
          </aside>
        </div>
      </section>

      {/* ===========================================================
          LOCATOR — CSS-only map motif over a tonal field, with the
          signature SVG-displacement refractive glass lens.
          =========================================================== */}
      <section className="band cx-locator">
        <div className="section container cx-locator__inner">
          <div className="cx-locator__copy reveal">
            <span className="cx-microlabel">
              <span className="cx-microlabel__n">03</span>
              <span className="cx-microlabel__t">Find us</span>
            </span>
            <h2 className="cx-locator__title">
              The studio in <em>Mont Kiara</em>.
            </h2>
            <p className="cx-locator__lede">
              Tucked into Menara YNH at Kiara 163 — at the heart of Mont Kiara,
              Kuala Lumpur. Drop by during studio hours, or reach us any time by
              message.
            </p>
            <div className="cx-coords" aria-hidden="true">
              <span className="cx-coords__pair">
                <b>3.1670° N</b>
                <small>Latitude</small>
              </span>
              <span className="cx-coords__pair">
                <b>101.6500° E</b>
                <small>Longitude</small>
              </span>
            </div>
            <address className="cx-locator__addr">{INFO.address}</address>
          </div>

          {/* Decorative locator — pure CSS, semantically hidden.
              SIGNATURE: a frosted SVG-refracting glass lens floats over the pin. */}
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
            {/* signature refractive lens — warps + magnifies the field beneath */}
            <span className="cx-lens">
              <span className="cx-lens__refract" />
              <span className="cx-lens__crosshair" />
            </span>
            <figcaption className="cx-map__cap">Menara YNH · Kiara 163</figcaption>
            {/* SIGNATURE: a frosted status chip reading the studio's real
                open/closed state live from its published hours */}
            <span
              className={`cx-map__status cx-status cx-status--${
                status.open ? 'open' : 'closed'
              }`}
            >
              <span className="cx-status__dot" aria-hidden="true" />
              {status.open ? 'Studio open' : 'Studio closed'}
            </span>
          </figure>
        </div>

        {/* hidden SVG filter — the liquid refraction for the lens (21st.dev
            feTurbulence + feDisplacementMap recipe, re-implemented natively) */}
        <svg className="cx-svg-defs" aria-hidden="true" focusable="false">
          <filter id="cx-glass-warp" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.014"
              numOctaves="2"
              seed="11"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="1.4" result="soft" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="soft"
              scale="26"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      </section>

      {/* ===========================================================
          CHANNELS — a "console" row of glass tiles over a tonal band
          =========================================================== */}
      <section className="cx-console">
        <div className="cx-console__field" aria-hidden="true" />
        <div className="section container cx-console__inner">
          <div className="cx-console__head reveal">
            <span className="cx-microlabel">
              <span className="cx-microlabel__n">04</span>
              <span className="cx-microlabel__t">Every way in</span>
            </span>
            <h2 className="cx-console__title">
              Three ways to <em>reach</em> us.
            </h2>
          </div>
          <div className="cx-tiles">
            {CHANNELS.map((c) => (
              <article className="cx-tile glass" key={c.idx}>
                <div className="cx-tile__top">
                  <Icon3D name={c.icon} className="cx-tile__ic" />
                  <span className="cx-tile__idx">{c.idx}</span>
                </div>
                <span className="cx-tile__label">{c.label}</span>
                <h3 className="cx-tile__title">{c.title}</h3>
                <ul className="cx-tile__lines">
                  {c.lines.map((l) => (
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

      {/* ===========================================================
          CTA
          =========================================================== */}
      <section className="cta">
        <div className="container cta__inner reveal">
          <h2>Rather just email us?</h2>
          <p className="lede">Write to {INFO.email} — we read every message.</p>
          <div className="cta__row">
            <Magnetic>
              <a className="btn btn--light" href={`mailto:${INFO.email}`}>
                Email the team
              </a>
            </Magnetic>
            <Link className="textlink textlink--ondark" to="/faq">
              Read the FAQ →
            </Link>
          </div>
          <p className="cx-cta__legal">{INFO.company}</p>
        </div>
      </section>
    </div>
  )
}
