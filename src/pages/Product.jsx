import '../styles/page-product.css'
import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCatalog } from '../store/catalog.js'
import { formatPrice } from '../data/products.js'
import { getGallery } from '../data/galleries.js'
import { useCart } from '../store/cart.js'
import ProductCard from '../components/ProductCard.jsx'
import Magnetic from '../lib/Magnetic.jsx'
import { usePublishedProps } from '../studio/usePublishedProps.js'
import { trackViewItem } from '../lib/analytics.js'

/* Product detail. Everything product-specific comes live from the catalog; the
   SHARED template copy (rating line, trust badges, assurances, the three info
   accordions, the "ritual" heading and the 404 copy) is editable in /studio →
   "Product template". Defaults below = the current page. */
export const DEFAULT_PRODUCT_SETTINGS = {
  ratingText: 'Loved by the ANJOE community',
  trust: ['Plant-based', 'Dermatologically tested', 'KKM-NPRA certified'],
  assurance: [
    'In stock — ready to ship',
    'Ships from Kuala Lumpur in 1–2 working days',
    'Shipping from RM7 · worldwide delivery',
    'Secure checkout — FPX, cards, Touch ’n Go, GrabPay',
  ],
  accordion: [
    { q: 'How to use', a: 'Apply to clean skin morning and night. Follow with the rest of your ANJOE ritual for best results.' },
    { q: 'Ingredients & certifications', a: 'Plant-based formula. Dermatologically tested; KKM-NPRA certified where applicable. Free from harsh fillers.' },
    { q: 'Shipping & returns', a: 'Prepared in 1–2 business days and shipped from Kuala Lumpur via GDEX Express — about 2–3 business days within Malaysia, 7–14 working days internationally. Wrong or defective items can be exchanged within 2 weeks; for hygiene reasons, opened products aren’t refundable.', link: { label: 'Full shipping & returns →', to: '/shipping' } },
  ],
  ritualEyebrow: 'Pairs well with',
  ritualTitleA: 'Complete the ',
  ritualTitleEm: 'ritual',
  ritualTitleB: '.',
  notFoundEyebrow: '404 — not found',
  notFoundTitle: 'We couldn’t find that.',
}

const strs = (arr, fallback) => {
  const out = (Array.isArray(arr) ? arr : []).map((x) => (typeof x === 'string' ? x : x?.label ?? x?.text)).filter(Boolean)
  return out.length ? out : fallback
}

export default function Product() {
  const { slug } = useParams()
  const products = useCatalog((s) => s.products)
  const product = products.find((p) => p.slug === slug)
  const add = useCart((s) => s.add)
  const [qty, setQty] = useState(1)
  const [active, setActive] = useState(0)
  const [showBar, setShowBar] = useState(false)
  const root = useRef(null)
  const buyRef = useRef(null)
  const s = { ...DEFAULT_PRODUCT_SETTINGS, ...usePublishedProps('product') }
  const trust = strs(s.trust, DEFAULT_PRODUCT_SETTINGS.trust)
  const assurance = strs(s.assurance, DEFAULT_PRODUCT_SETTINGS.assurance)
  const accordion = Array.isArray(s.accordion) && s.accordion.length ? s.accordion : DEFAULT_PRODUCT_SETTINGS.accordion

  // Admin images drive the gallery when present; otherwise fall back to the static
  // galleries.js (then the single product.img). So uploads in the admin show on the PDP.
  const gallery = product
    ? (product.images?.length ? product.images : getGallery(slug, product.img))
    : []
  const go = (i) => {
    const n = gallery.length || 1
    setActive(((i % n) + n) % n)
  }

  useEffect(() => {
    setActive(0)
    setQty(1)
  }, [slug])

  // GA4 + Pixel view_item when a product loads.
  useEffect(() => {
    if (product) {
      try { trackViewItem({ id: product.id, name: product.name, price: product.price }) } catch { /* ignore */ }
    }
  }, [product])

  useEffect(() => {
    const el = buyRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting),
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [slug, product])

  useEffect(() => {
    if (!product) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !root.current) return

    const ctx = gsap.context(() => {
      const cipher = root.current.querySelector('.pdpx-gallery__cipher')
      if (cipher) {
        gsap.to(cipher, { yPercent: -22, ease: 'none', scrollTrigger: { trigger: '.pdpx-split', start: 'top top', end: 'bottom top', scrub: true } })
      }
      const bottle = root.current.querySelector('.pdpx-bottle')
      if (bottle) {
        gsap.to(bottle, { yPercent: -7, ease: 'none', scrollTrigger: { trigger: '.pdpx-stage', start: 'top bottom', end: 'bottom top', scrub: true } })
      }
      const rghost = root.current.querySelector('.pdpx-ritual__ghost')
      if (rghost) {
        gsap.to(rghost, { yPercent: -16, ease: 'none', scrollTrigger: { trigger: '.pdpx-ritual', start: 'top bottom', end: 'bottom top', scrub: true } })
      }
    }, root)

    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [slug, product])

  if (!product) {
    return (
      <section className="section container pdpx-missing">
        <p className="pdpx-missing__ghost" aria-hidden="true">
          404
        </p>
        <span className="eyebrow">{s.notFoundEyebrow}</span>
        <h1>{s.notFoundTitle}</h1>
        <Link to="/shop" className="textlink">
          Back to the collection →
        </Link>
      </section>
    )
  }

  const related = products.filter((p) => p.slug !== slug && p.group === product.group).slice(0, 3)

  return (
    <div className="pdpx" ref={root}>
      <div className="container">
        <nav className="pdpx-crumb" aria-label="Breadcrumb">
          <Link to="/shop">Shop</Link>
          <span className="pdpx-crumb__sep">/</span>
          <span className="pdpx-crumb__here">{product.name}</span>
        </nav>

        <div className="pdpx-split">
          <span className="pdpx-rail">{product.eyebrow || product.type}</span>

          <div className="pdpx-gallery reveal">
            <div className="pdpx-gallery__cipher" aria-hidden="true">
              <span className="pdpx-gallery__cipher-no">
                {(product.slug.match(/\d+/) || [String(product.name.length).padStart(2, '0')])[0]}
              </span>
              <span className="pdpx-gallery__cipher-rule" />
              <span className="pdpx-gallery__cipher-type">{product.type}</span>
              <span className="pdpx-gallery__cipher-mark">ANJOE · No.</span>
            </div>

            <div className="pdpx-stage">
              <span className="pdpx-stage__halo" aria-hidden="true" />
              <span className="pdpx-stage__sweep" aria-hidden="true" />
              <span className="pdpx-stage__lens" aria-hidden="true" />
              <img className="pdpx-bottle" src={gallery[active] || product.img} alt={product.name} />
              <span className="pdpx-stage__badge glass">
                <span className="pdpx-stage__badge-mark" aria-hidden="true" />
                {product.size ? product.size : 'Plant-based'}
              </span>
              <span className="pdpx-stage__caption glass" aria-hidden="true">
                <span className="pdpx-stage__caption-no">{product.type}</span>
                <span className="pdpx-stage__caption-line" />
                <span className="pdpx-stage__caption-anjoe">ANJOE</span>
              </span>

              {gallery.length > 1 && (
                <>
                  <button className="pdpx-nav pdpx-nav--prev glass" onClick={() => go(active - 1)} aria-label="Previous image">
                    ‹
                  </button>
                  <button className="pdpx-nav pdpx-nav--next glass" onClick={() => go(active + 1)} aria-label="Next image">
                    ›
                  </button>
                </>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="pdpx-thumbs" role="group" aria-label="Product images">
                <span className="pdpx-thumbs__count" aria-hidden="true">
                  {String(active + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
                </span>
                <div className="pdpx-thumbs__rail">
                  {gallery.map((src, i) => (
                    <button
                      key={src}
                      className={`pdpx-thumb${i === active ? ' is-active' : ''}`}
                      onClick={() => setActive(i)}
                      aria-label={`View image ${i + 1}`}
                      aria-current={i === active}
                    >
                      <img src={src} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pdpx-info">
            <span className="eyebrow pdpx-info__eyebrow">{product.eyebrow || product.type}</span>
            <h1 className="pdpx-info__title">{product.name}</h1>

            <div className="pdpx-priceline">
              <span className="pdpx-price">
                {formatPrice(product.price)}
                {product.size && <span className="pdpx-price__size">/ {product.size}</span>}
              </span>
              <span className="pdpx-rating">
                <span className="pdpx-rating__stars" aria-hidden="true">
                  ★★★★★
                </span>
                <em>{s.ratingText}</em>
              </span>
            </div>

            <p className="lede pdpx-lede">{product.blurb}</p>

            {product.notes && (
              <ul className="pdpx-notes">
                {product.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}

            <div className="pdpx-trust glass">
              {trust.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>

            <div className="pdpx-buy glass glass--strong" ref={buyRef}>
              <span className="pdpx-buy__label" aria-hidden="true">Quantity</span>
              <div className="qty qty--lg">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  −
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                  +
                </button>
              </div>
              <Magnetic className="pdpx-buy__mag">
                <button className="btn pdpx-add" onClick={() => add(product, qty)}>
                  Add to bag — {formatPrice(product.price * qty)}
                </button>
              </Magnetic>
            </div>

            <ul className="pdpx-assure glass">
              {assurance.map((a) => (
                <li key={a}>
                  <span className="pdpx-assure__ic" aria-hidden="true" /> {a}
                </li>
              ))}
            </ul>

            <div className="pdpx-acc glass">
              {accordion.map((it, i) => (
                <details key={it.q}>
                  <summary>
                    <span>
                      <span className="pdpx-acc__idx">{String(i + 1).padStart(2, '0')}</span>{it.q}
                    </span>
                  </summary>
                  <p>
                    {it.a}
                    {it.link ? (
                      <>
                        {' '}
                        <Link className="textlink--inline" to={it.link.to}>
                          {it.link.label}
                        </Link>
                      </>
                    ) : null}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section pdpx-ritual">
          <p className="pdpx-ritual__ghost" aria-hidden="true">
            Ritual
          </p>
          <div className="container pdpx-ritual__inner">
            <div className="pdpx-ritual__head reveal">
              <div>
                <span className="eyebrow">{s.ritualEyebrow}</span>
                <h2>
                  {s.ritualTitleA}<em>{s.ritualTitleEm}</em>{s.ritualTitleB}
                </h2>
              </div>
              <p className="pdpx-ritual__note">
                Three more steps from the same {product.group === 'sets' ? 'edit' : 'collection'}.
              </p>
            </div>

            <div className="pdpx-ritual__grid">
              {related.map((p, i) => (
                <div className="pdpx-ritual__step reveal" key={p.id}>
                  <div className="pdpx-ritual__step-tag">
                    <span className="pdpx-ritual__step-num">{String(i + 1).padStart(2, '0')}</span>
                    <span>{p.type}</span>
                    <span className="pdpx-ritual__step-rule" aria-hidden="true" />
                  </div>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className={`pdpx-buybar${showBar ? ' is-visible' : ''}`}>
        <div className="pdpx-buybar__info">
          <span className="pdpx-buybar__name">{product.name}</span>
          <span className="pdpx-buybar__price">{formatPrice(product.price * qty)}</span>
        </div>
        <button
          className="btn pdpx-buybar__add"
          onClick={() => add(product, qty)}
          tabIndex={showBar ? 0 : -1}
        >
          Add to bag
        </button>
      </div>
    </div>
  )
}
