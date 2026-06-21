import '../styles/page-faq.css'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Icon3D from '../components/Icon3D.jsx'
import Magnetic from '../lib/Magnetic.jsx'

/* FAQ. Bespoke design stays in code; the hero copy, payment list and the grouped
   Q&A are prop-driven (editable in /studio). Defaults below = the current page.
   Answers may be plain text, or one of three sentinels rendered as rich blocks:
   "pay-list", "shipping-link", "build-link". */
export const DEFAULT_PAYMENTS = [
  'FPX — Malaysia online banking',
  'Grab',
  'Maybank QR',
  'Touch ’n Go',
  'Boost',
  'Credit & debit cards (Visa / Mastercard)',
]

export const DEFAULT_GROUPS = [
  {
    id: 'orders', idx: '01', icon: 'test-tube', title: 'Orders & Payment', short: 'Orders',
    note: 'Placing, confirming and paying for your order.',
    items: [
      { q: 'How do I place an order?', a: 'Browse the shop, add the items you want to your cart, then open the cart at the top-right and check out. Enter any promo code in the voucher field, fill in your shipping address, method and payment option, then place your order. You’ll receive a confirmation email shortly after.' },
      { q: 'How do I know if my order went through?', a: 'You’ll receive a confirmation email after a successful order. You can also log in and check “My orders” under your account.' },
      { q: 'Can I change or cancel my order once it’s placed?', a: 'Unfortunately not — once an order is placed it’s prepared and readied for shipment very quickly, so changes and cancellations aren’t possible.' },
      { q: 'What payment methods can I use?', a: 'pay-list' },
      { q: 'What if my payment failed?', a: 'A few things can cause a payment to fail. Reach out to our customer-service team and we’ll help you complete your order.' },
    ],
  },
  {
    id: 'shipping', idx: '02', icon: 'shield', title: 'Shipping & Delivery', short: 'Shipping',
    note: 'Timelines, rates and tracking your parcel.',
    items: [
      { q: 'How long until my order ships?', a: 'Orders take 1–2 business days to prepare. Once ready, we ship via GDEX Express — typically 2–3 business days within Malaysia. Your tracking code is emailed to you once the parcel is shipped.' },
      { q: 'How much is shipping and where do you deliver?', a: 'shipping-link' },
      { q: 'Do you ship internationally?', a: 'Yes — international delivery is typically 7–14 working days. Destination countries may levy customs taxes or duties, which the receiver is responsible for. Please check your country’s customs policies before ordering.' },
      { q: 'My package hasn’t arrived yet — what should I do?', a: 'If your package doesn’t arrive within 7 business days of shipment, contact our customer-service team. Please note weekends and public holidays are not counted as business days.' },
    ],
  },
  {
    id: 'products', idx: '03', icon: 'herb', title: 'Products & Usage', short: 'Products',
    note: 'Formulas, suitability and building your ritual.',
    items: [
      { q: 'Are ANJOE products suitable for sensitive skin?', a: 'Our formulas are dermatologically tested and KKM-NPRA certified, and designed to be gentle on reactive, sensitive skin. As with any new skincare, we recommend a patch test before first use.' },
      { q: 'Are the formulas plant-based?', a: 'Yes — the range is plant-based, built around botanical actives such as grape seed, Vitamin E, mugwort and rice ferment, and free from unnecessary synthetic fillers.' },
      { q: 'How do I build my routine?', a: 'build-link' },
    ],
  },
]

function Answer({ a, payments }) {
  if (a === 'pay-list') {
    return (
      <div className="faqx-pay">
        <p>
          We accept several secure payment methods, processed via revPAY,
          Paydibs and Stripe:
        </p>
        <ul>
          {payments.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    )
  }
  if (a === 'shipping-link') {
    return (
      <p>
        We ship from Kuala Lumpur across Malaysia and worldwide. See the full
        rate card and timelines on our{' '}
        <Link className="textlink textlink--inline" to="/shipping">
          shipping page →
        </Link>
      </p>
    )
  }
  if (a === 'build-link') {
    return (
      <p>
        Cleanse, layer your essence and serum, then seal with moisturiser —
        morning and night. Start with the cleanser and build from there.{' '}
        <Link className="textlink textlink--inline" to="/shop">
          Browse the collection →
        </Link>
      </p>
    )
  }
  return <p>{a}</p>
}

export default function FAQ({
  kicker = 'Help centre',
  titleA = 'Everything,',
  titleEm = 'answered',
  titleB = '.',
  lede = 'Orders, payment, delivery and getting the most from your ANJOE ritual — sorted by topic, plainly answered.',
  email = 'hello@madebyanjoe.com',
  consoleLabel = 'answers ready',
  payments = DEFAULT_PAYMENTS,
  groups = DEFAULT_GROUPS,
  stillTitle = 'Can’t find your answer in the topics above?',
  ctaTitle = 'Didn’t find your answer?',
  ctaLede = 'Email the team at hello@madebyanjoe.com and we’ll get back to you.',
} = {}) {
  const root = useRef(null)
  const list = Array.isArray(groups) && groups.length ? groups : DEFAULT_GROUPS
  const pays = Array.isArray(payments) && payments.length
    ? payments.map((p) => (typeof p === 'string' ? p : p?.label)).filter(Boolean)
    : DEFAULT_PAYMENTS
  const [active, setActive] = useState(list[0].id)

  const jumpTo = (id) => {
    const el = document.getElementById(`faq-${id}`)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    setActive(id)
  }

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!root.current) return

    const ctx = gsap.context(() => {
      list.forEach((g) => {
        ScrollTrigger.create({
          trigger: `#faq-${g.id}`,
          start: 'top 44%',
          end: 'bottom 44%',
          onToggle: (self) => {
            if (self.isActive) setActive(g.id)
          },
        })
      })

      if (reduce) return

      const console = root.current.querySelector('.faqx-console')
      if (console) {
        gsap.to(console, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.faqx-hero', start: 'top top', end: 'bottom top', scrub: true } })
      }
      gsap.utils.toArray('.faqx-group').forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, ease: 'power3.out', duration: 1, scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
    }, root)

    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [list])

  const totalQuestions = list.reduce((n, g) => n + (g.items?.length || 0), 0)
  const activeGroup = list.find((g) => g.id === active) || list[0]

  return (
    <div className="faqx" ref={root}>
      <header className="page-hero faqx-hero">
        <div className="page-hero__wash" />
        <div className="faqx-hero__field" aria-hidden="true" />
        <div className="container faqx-hero__grid">
          <div className="faqx-hero__lead">
            <span className="faqx-kicker">
              <span className="faqx-kicker__mark" aria-hidden="true" />
              {kicker}
              <span className="faqx-kicker__rule" aria-hidden="true" />
              <span className="faqx-kicker__meta">
                {String(totalQuestions).padStart(2, '0')} answers
              </span>
            </span>
            <h1 className="faqx-hero__title">
              {titleA}
              <br />
              <em>{titleEm}</em>{titleB}
            </h1>
            <p className="lede">
              {lede}{' '}Still stuck? Email{' '}
              <a className="textlink textlink--inline" href={`mailto:${email}`}>
                {email}
              </a>
              .
            </p>
          </div>

          <aside className="faqx-console glass glass--strong" aria-label="Help centre at a glance">
            <div className="faqx-console__sheen" aria-hidden="true" />
            <div className="faqx-console__head">
              <span className="faqx-console__tally" aria-hidden="true">
                {String(totalQuestions).padStart(2, '0')}
              </span>
              <span className="faqx-console__label">
                {consoleLabel}
                <i>across {list.length} topics</i>
              </span>
            </div>
            <ul className="faqx-console__dial">
              {list.map((g) => (
                <li key={g.id}>
                  <a
                    href={`#faq-${g.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      jumpTo(g.id)
                    }}
                  >
                    <span className="faqx-console__num" aria-hidden="true">
                      {g.idx}
                    </span>
                    <Icon3D name={g.icon} className="faqx-console__ic" />
                    <span className="faqx-console__topic">{g.title}</span>
                    <span className="faqx-console__n">{g.items?.length || 0}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </header>

      <section className="band faqx-body">
        <div className="container">
          <div className="faqx-switch" role="navigation" aria-label="Jump to topic">
            <span className="faqx-switch__lead" aria-hidden="true">
              Browse
            </span>
            <div className="faqx-switch__track">
              <span
                className="faqx-switch__thumb"
                aria-hidden="true"
                style={{
                  '--seg': list.findIndex((g) => g.id === active),
                  '--segs': list.length,
                }}
              />
              {list.map((g) => (
                <button
                  type="button"
                  key={g.id}
                  className={`faqx-switch__seg${active === g.id ? ' is-active' : ''}`}
                  aria-current={active === g.id ? 'true' : undefined}
                  onClick={() => jumpTo(g.id)}
                >
                  <span className="faqx-switch__seg-short">{g.short}</span>
                  <span className="faqx-switch__seg-n">{g.items?.length || 0}</span>
                </button>
              ))}
            </div>
            <span className="faqx-switch__now" aria-live="polite">
              {activeGroup.idx} / {String(list.length).padStart(2, '0')}
            </span>
          </div>

          <div className="faqx-stack">
            {list.map((g) => (
              <section className="faqx-group" id={`faq-${g.id}`} key={g.id} aria-label={g.title}>
                <div className="faqx-spine">
                  <span className="faqx-spine__seal" aria-hidden="true">
                    <Icon3D name={g.icon} className="faqx-spine__ic" />
                    <span className="faqx-spine__num">{g.idx}</span>
                  </span>
                  <span className="faqx-spine__idx">
                    Topic {g.idx}
                    <span className="faqx-spine__dot" aria-hidden="true" />
                    {g.items?.length || 0} questions
                  </span>
                  <h2 className="faqx-spine__title">{g.title}</h2>
                  <p className="faqx-spine__note">{g.note}</p>
                </div>

                <div className="faqx-acc">
                  {(g.items || []).map((it, i) => (
                    <details key={it.q}>
                      <summary>
                        <span className="faqx-acc__q">
                          <span className="faqx-acc__idx">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {it.q}
                        </span>
                        <span className="faqx-acc__toggle" aria-hidden="true" />
                      </summary>
                      <div className="faqx-acc__body">
                        <Answer a={it.a} payments={pays} />
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}

            <aside className="faqx-still glass" aria-label="Still need help">
              <div className="faqx-still__sheen" aria-hidden="true" />
              <Icon3D name="sparkles" className="faqx-still__ic" />
              <div className="faqx-still__copy">
                <span className="faqx-kicker faqx-kicker--quiet">
                  <span className="faqx-kicker__mark" aria-hidden="true" />
                  Still searching
                </span>
                <p>{stillTitle}</p>
                <Link className="textlink" to="/contact">
                  Contact the team →
                </Link>
              </div>
            </aside>
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
            <Link className="textlink textlink--ondark" to="/shipping">
              Shipping &amp; returns →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
