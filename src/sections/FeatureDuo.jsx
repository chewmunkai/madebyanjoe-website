import { Link } from 'react-router-dom'
import { getProduct } from '../data/products.js'

/* Product spotlight duo — Torriden's staggered two-up: the left feature leads
   with its image, the right leads with copy and drops its image lower, so the
   two columns interlock. */
const features = [
  { slug: 'probiotic-mask', eyebrow: 'Probiotic sheet mask', title: 'Quench & Glow, in one sheet.', layout: 'media-first' },
  { slug: 'antioxidant-serum', eyebrow: 'Antioxidant serum', title: 'Defend, brighten, glow.', layout: 'text-first' },
]

export default function FeatureDuo() {
  return (
    <section className="fd">
      <div className="container fd__grid">
        {features.map((f) => {
          const p = getProduct(f.slug)
          const media = (
            <Link to={`/product/${p.slug}`} className="fd__media">
              <img src={p.img} alt={p.name} loading="lazy" />
            </Link>
          )
          const body = (
            <div className="fd__body">
              <span className="eyebrow">{f.eyebrow}</span>
              <h3 className="fd__title">{f.title}</h3>
              <p className="fd__blurb">{p.blurb}</p>
              <Link to={`/product/${p.slug}`} className="fd__btn">
                Learn more
              </Link>
            </div>
          )
          return (
            <article className={`fd__card fd__card--${f.layout} reveal`} key={f.slug}>
              {f.layout === 'media-first' ? (
                <>
                  {media}
                  {body}
                </>
              ) : (
                <>
                  {body}
                  {media}
                </>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
