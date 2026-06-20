import '../styles/page-faq.css'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Icon3D from '../components/Icon3D.jsx'
import Magnetic from '../lib/Magnetic.jsx'

/* Real Q&A — sourced verbatim (lightly trimmed) from the live site's
   Order & Payment + Shipping pages. No fabricated answers or policies. */
const PAYMENTS = [
  'FPX — Malaysia online banking',
  'Grab',
  'Maybank QR',
  'Touch ’n Go',
  'Boost',
  'Credit & debit cards (Visa / Mastercard)',
]

const GROUPS = [
  {
    id: 'orders',
    idx: '01',
    icon: 'test-tube',
    title: 'Orders & Payment',
    short: 'Orders',
    note: 'Placing, confirming and paying for your order.',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse the shop, add the items you want to your cart, then open the cart at the top-right and check out. Enter any promo code in the voucher field, fill in your shipping address, method and payment option, then place your order. You’ll receive a confirmation email shortly after.',
      },
      {
        q: 'How do I know if my order went through?',
        a: 'You’ll receive a confirmation email after a successful order. You can also log in and check “My orders” under your account.',
      },
      {
        q: 'Can I change or cancel my order once it’s placed?',
        a: 'Unfortunately not — once an order is placed it’s prepared and readied for shipment very quickly, so changes and cancellations aren’t possible.',
      },
      {
        q: 'What payment methods can I use?',
        a: 'pay-list',
      },
      {
        q: 'What if my payment failed?',
        a: 'A few things can cause a payment to fail. Reach out to our customer-service team and we’ll help you complete your order.',
      },
    ],
  },
  {
    id: 'shipping',
    idx: '02',
    icon: 'shield',
    title: 'Shipping & Delivery',
    short: 'Shipping',
    note: 'Timelines, rates and tracking your parcel.',
    items: [
      {
        q: 'How long until my order ships?',
        a: 'Orders take 1–2 business days to prepare. Once ready, we ship via GDEX Express — typically 2–3 business days within Malaysia. Your tracking code is emailed to you once the parcel is shipped.',
      },
      {
        q: 'How much is shipping and where do you deliver?',
        a: 'shipping-link',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes — international delivery is typically 7–14 working days. Destination countries may levy customs taxes or duties, which the receiver is responsible for. Please check your country’s customs policies before ordering.',
      },
      {
        q: 'My package hasn’t arrived yet — what should I do?',
        a: 'If your package doesn’t arrive within 7 business days of shipment, contact our customer-service team. Please note weekends and public holidays are not counted as business days.',
      },
    ],
  },
  {
    id: 'products',
    idx: '03',
    icon: 'herb',
    title: 'Products & Usage',
    short: 'Products',
    note: 'Formulas, suitability and building your ritual.',
    items: [
      {
        q: 'Are ANJOE products suitable for sensitive skin?',
        a: 'Our formulas are dermatologically tested and KKM-NPRA certified, and designed to be gentle on reactive, sensitive skin. As with any new skincare, we recommend a patch test before first use.',
      },
      {
        q: 'Are the formulas plant-based?',
        a: 'Yes — the range is plant-based, built around botanical actives such as grape seed, Vitamin E, mugwort and rice ferment, and free from unnecessary synthetic fillers.',
      },
      {
        q: 'How do I build my routine?',
        a: 'build-link',
      },
    ],
  },
]

function Answer({ a }) {
  if (a === 'pay-list') {
    return (
      <div className="faqx-pay">
        <p>
          We accept several secure payment methods, processed via revPAY,
          Paydibs and Stripe:
        </p>
        <ul>
          {PAYMENTS.map((p) => (
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

export default function FAQ() {
  const root = useRef(null)
  const [active, setActive] = useState(GROUPS[0].id)

  // Programmatic jump from the glass switcher — native smooth scroll to the
  // group anchor; the scroll-spy below then promotes the active segment.
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
      // Scroll-spy → highlight the group currently in view (always, even under
      // reduced motion — it’s a navigation aid, not decorative motion).
      GROUPS.forEach((g) => {
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

      // Parallax-float the frosted console card against the hero as it scrolls.
      const console = root.current.querySelector('.faqx-console')
      if (console) {
        gsap.to(console, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: '.faqx-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // Gentle staggered lift on each group slab as it enters.
      gsap.utils.toArray('.faqx-group').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          ease: 'power3.out',
          duration: 1,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
    }, root)

    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [])

  const totalQuestions = GROUPS.reduce((n, g) => n + g.items.length, 0)
  const activeGroup = GROUPS.find((g) => g.id === active) || GROUPS[0]

  return (
    <div className="faqx" ref={root}>
      {/* ============================================================
          HERO — asymmetric editorial stage: oversized title on a tonal
          field, with a floating frosted "console" overlapping the band.
          ============================================================ */}
      <header className="page-hero faqx-hero">
        <div className="page-hero__wash" />
        <div className="faqx-hero__field" aria-hidden="true" />
        <div className="container faqx-hero__grid">
          <div className="faqx-hero__lead">
            <span className="faqx-kicker">
              <span className="faqx-kicker__mark" aria-hidden="true" />
              Help centre
              <span className="faqx-kicker__rule" aria-hidden="true" />
              <span className="faqx-kicker__meta">
                {String(totalQuestions).padStart(2, '0')} answers
              </span>
            </span>
            <h1 className="faqx-hero__title">
              Everything,
              <br />
              <em>answered</em>.
            </h1>
            <p className="lede">
              Orders, payment, delivery and getting the most from your ANJOE
              ritual — sorted by topic, plainly answered. Still stuck? Email{' '}
              <a
                className="textlink textlink--inline"
                href="mailto:hello@madebyanjoe.com"
              >
                hello@madebyanjoe.com
              </a>
              .
            </p>
          </div>

          {/* SIGNATURE: frosted "concierge console" — a stacked glass card with
              a tabular answer tally over a topic dial that jumps into the page */}
          <aside
            className="faqx-console glass glass--strong"
            aria-label="Help centre at a glance"
          >
            <div className="faqx-console__sheen" aria-hidden="true" />
            <div className="faqx-console__head">
              <span className="faqx-console__tally" aria-hidden="true">
                {String(totalQuestions).padStart(2, '0')}
              </span>
              <span className="faqx-console__label">
                answers ready
                <i>across {GROUPS.length} topics</i>
              </span>
            </div>
            <ul className="faqx-console__dial">
              {GROUPS.map((g) => (
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
                    <span className="faqx-console__n">{g.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </header>

      {/* ============================================================
          BODY — tonal field; a sticky GLASS SEGMENTED SWITCHER floats over
          a single editorial stack of grouped glass accordion slabs.
          ============================================================ */}
      <section className="band faqx-body">
        <div className="container">
          {/* SIGNATURE control: Apple-style frosted segmented switcher.
              Scroll-spy promotes the live segment; clicking jumps the page. */}
          <div className="faqx-switch" role="navigation" aria-label="Jump to topic">
            <span className="faqx-switch__lead" aria-hidden="true">
              Browse
            </span>
            <div className="faqx-switch__track">
              <span
                className="faqx-switch__thumb"
                aria-hidden="true"
                style={{
                  '--seg': GROUPS.findIndex((g) => g.id === active),
                  '--segs': GROUPS.length,
                }}
              />
              {GROUPS.map((g) => (
                <button
                  type="button"
                  key={g.id}
                  className={`faqx-switch__seg${
                    active === g.id ? ' is-active' : ''
                  }`}
                  aria-current={active === g.id ? 'true' : undefined}
                  onClick={() => jumpTo(g.id)}
                >
                  <span className="faqx-switch__seg-short">{g.short}</span>
                  <span className="faqx-switch__seg-n">{g.items.length}</span>
                </button>
              ))}
            </div>
            <span className="faqx-switch__now" aria-live="polite">
              {activeGroup.idx} / {String(GROUPS.length).padStart(2, '0')}
            </span>
          </div>

          {/* Asymmetric editorial stack — each group is a glass slab with a
              left "spine" (seal + meta) and a column of glass accordions. */}
          <div className="faqx-stack">
            {GROUPS.map((g) => (
              <section
                className="faqx-group"
                id={`faq-${g.id}`}
                key={g.id}
                aria-label={g.title}
              >
                {/* SPINE — sticky topic identity inside the asymmetric frame */}
                <div className="faqx-spine">
                  <span className="faqx-spine__seal" aria-hidden="true">
                    <Icon3D name={g.icon} className="faqx-spine__ic" />
                    <span className="faqx-spine__num">{g.idx}</span>
                  </span>
                  <span className="faqx-spine__idx">
                    Topic {g.idx}
                    <span className="faqx-spine__dot" aria-hidden="true" />
                    {g.items.length} questions
                  </span>
                  <h2 className="faqx-spine__title">{g.title}</h2>
                  <p className="faqx-spine__note">{g.note}</p>
                </div>

                {/* ACCORDION COLUMN — native <details> as glass panels */}
                <div className="faqx-acc">
                  {g.items.map((it, i) => (
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
                        <Answer a={it.a} />
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}

            {/* In-stack frosted callout — replaces the old left-rail aside */}
            <aside className="faqx-still glass" aria-label="Still need help">
              <div className="faqx-still__sheen" aria-hidden="true" />
              <Icon3D name="sparkles" className="faqx-still__ic" />
              <div className="faqx-still__copy">
                <span className="faqx-kicker faqx-kicker--quiet">
                  <span className="faqx-kicker__mark" aria-hidden="true" />
                  Still searching
                </span>
                <p>Can’t find your answer in the topics above?</p>
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
          <h2>Didn’t find your answer?</h2>
          <p className="lede">
            Email the team at hello@madebyanjoe.com and we’ll get back to you.
          </p>
          <div className="cta__row">
            <Magnetic>
              <a className="btn btn--light" href="mailto:hello@madebyanjoe.com">
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
