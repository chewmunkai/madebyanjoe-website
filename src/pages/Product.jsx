import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct, getRelated, formatPrice } from '../data/products.js'
import { useCart } from '../store/cart.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Product() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const add = useCart((s) => s.add)
  const [qty, setQty] = useState(1)

  if (!product) {
    return (
      <section className="section container pdp-missing">
        <span className="eyebrow">404</span>
        <h1>We couldn’t find that.</h1>
        <Link to="/shop" className="textlink">
          Back to the collection →
        </Link>
      </section>
    )
  }

  const related = getRelated(slug, 3)

  return (
    <>
      <section className="pdp">
        <div className="container pdp__crumb">
          <Link to="/shop">Shop</Link> <span>/</span> {product.name}
        </div>
        <div className="container pdp__inner">
          <div className="pdp__media reveal">
            <div className="pdp__wash" />
            <img src={product.img} alt={product.name} />
          </div>

          <div className="pdp__info">
            <span className="eyebrow">{product.eyebrow || product.type}</span>
            <h1>{product.name}</h1>
            <div className="pdp__price">
              {formatPrice(product.price)}
              {product.size && <span className="pdp__size">/ {product.size}</span>}
            </div>
            <p className="lede">{product.blurb}</p>

            {product.notes && (
              <ul className="pdp__notes">
                {product.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}

            <div className="pdp__buy">
              <div className="qty qty--lg">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  −
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                  +
                </button>
              </div>
              <button className="btn pdp__add" onClick={() => add(product, qty)}>
                Add to bag — {formatPrice(product.price * qty)}
              </button>
            </div>

            <div className="pdp__meta">
              <details>
                <summary>How to use</summary>
                <p>
                  Apply to clean skin morning and night. Follow with the rest of
                  your ANJOE ritual for best results.
                </p>
              </details>
              <details>
                <summary>Ingredients &amp; certifications</summary>
                <p>
                  Plant-based formula. Dermatologically tested; KKM-NPRA certified
                  where applicable. Free from harsh fillers.
                </p>
              </details>
              <details>
                <summary>Shipping &amp; returns</summary>
                <p>Ships from Malaysia. See our shipping policy for timelines and returns.</p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section container">
          <div className="sec-head">
            <span className="eyebrow reveal">Pairs well with</span>
            <h2 className="reveal">Complete the ritual</h2>
          </div>
          <div className="grid grid--3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
