import '../styles/page-product.css'
import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getProduct, getRelated, formatPrice } from '../data/products.js'
import { getGallery } from '../data/galleries.js'
import { useCart } from '../store/cart.js'
import ProductCard from '../components/ProductCard.jsx'
import Magnetic from '../lib/Magnetic.jsx'

export default function Product() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const add = useCart((s) => s.add)
  const [qty, setQty] = useState(1)
  const [active, setActive] = useState(0)
  const root = useRef(null)

  const gallery = product ? getGallery(slug, product.img) : []
  const go = (i) => {
    const n = gallery.length || 1
    setActive(((i % n) + n) % n)
  }

  // reset carousel + qty when navigating to another product
  useEffect(() => {
    setActive(0)
    setQty(1)
  }, [slug])

  // Editorial parallax: drift the giant faded numeral + float the bottle as the
  // gallery scrolls. Centralised ScrollTrigger registration (SmoothScroll.jsx).
  // Re-run on slug change so a navigated PDP re-binds to the new nodes.
  useEffect(() => {
    if (!product) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !root.current) return

    const ctx = gsap.context(() => {
      const cipher = root.current.querySelector('.pdpx-gallery__cipher')
      if (cipher) {
        gsap.to(cipher, {
          yPercent: -22,
          ease: 'none',
          scrollTrigger: { trigger: '.pdpx-split', start: 'top top', end: 'bottom top', scrub: true },
        })
      }
      const bottle = root.current.querySelector('.pdpx-bottle')
      if (bottle) {
        gsap.to(bottle, {
          yPercent: -7,
          ease: 'none',
          scrollTrigger: { trigger: '.pdpx-stage', start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }
      const rghost = root.current.querySelector('.pdpx-ritual__ghost')
      if (rghost) {
        gsap.to(rghost, {
          yPercent: -16,
          ease: 'none',
          scrollTrigger: { trigger: '.pdpx-ritual', start: 'top bottom', end: 'bottom top', scrub: true },
        })
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
        <span className="eyebrow">404 — not found</span>
        <h1>We couldn’t find that.</h1>
        <Link to="/shop" className="textlink">
          Back to the collection →
        </Link>
      </section>
    )
  }

  const related = getRelated(slug, 3)

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

          {/* LAYERED GALLERY — washed niche, floating bottle, exploded facets */}
          <div className="pdpx-gallery reveal">
            {/* De-Claude: the generic faded italic-word ghost is replaced by an
                engraved archival cipher — the product's catalogue index + type
                set as a thin vertical plate, the way a vitrine label is etched
                into the wall beside the object. Crafted, brand-specific depth. */}
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
              {/* SIGNATURE — a slow specular catch-light that sweeps the niche */}
              <span className="pdpx-stage__sweep" aria-hidden="true" />
              {/* SIGNATURE — a refractive glass lens-rim hugging the niche lip */}
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
                  <button
                    className="pdpx-nav pdpx-nav--prev glass"
                    onClick={() => go(active - 1)}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    className="pdpx-nav pdpx-nav--next glass"
                    onClick={() => go(active + 1)}
                    aria-label="Next image"
                  >
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

          {/* STICKY EDITORIAL BUY COLUMN */}
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
                <em>Loved by the ANJOE community</em>
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
              <span>Plant-based</span>
              <span>Dermatologically tested</span>
              <span>KKM-NPRA certified</span>
            </div>

            <div className="pdpx-buy glass glass--strong">
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
              <li>
                <span className="pdpx-assure__ic" aria-hidden="true" /> In stock — ready to ship
              </li>
              <li>
                <span className="pdpx-assure__ic" aria-hidden="true" /> Ships from Kuala Lumpur in 1–2 working days
              </li>
              <li>
                <span className="pdpx-assure__ic" aria-hidden="true" /> Shipping from RM7 · worldwide delivery
              </li>
              <li>
                <span className="pdpx-assure__ic" aria-hidden="true" /> Secure checkout — FPX, cards, Touch ’n Go, GrabPay
              </li>
            </ul>

            <div className="pdpx-acc glass">
              <details>
                <summary>
                  <span>
                    <span className="pdpx-acc__idx">01</span>How to use
                  </span>
                </summary>
                <p>
                  Apply to clean skin morning and night. Follow with the rest of your ANJOE ritual for
                  best results.
                </p>
              </details>
              <details>
                <summary>
                  <span>
                    <span className="pdpx-acc__idx">02</span>Ingredients &amp; certifications
                  </span>
                </summary>
                <p>
                  Plant-based formula. Dermatologically tested; KKM-NPRA certified where applicable. Free
                  from harsh fillers.
                </p>
              </details>
              <details>
                <summary>
                  <span>
                    <span className="pdpx-acc__idx">03</span>Shipping &amp; returns
                  </span>
                </summary>
                <p>
                  Prepared in 1–2 business days and shipped from Kuala Lumpur via GDEX Express — about 2–3
                  business days within Malaysia, 7–14 working days internationally. Wrong or defective
                  items can be exchanged within 2 weeks; for hygiene reasons, opened products aren’t
                  refundable.{' '}
                  <Link className="textlink--inline" to="/shipping">
                    Full shipping &amp; returns →
                  </Link>
                </p>
              </details>
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
                <span className="eyebrow">Pairs well with</span>
                <h2>
                  Complete the <em>ritual</em>.
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
    </div>
  )
}
