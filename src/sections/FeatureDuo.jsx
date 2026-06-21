import { Link } from 'react-router-dom'
import { useCatalog } from '../store/catalog.js'

/* Product spotlight duo — Torriden's staggered two-up: the left feature leads
   with its image, the right leads with copy and drops its image lower, so the two
   columns interlock. Each card's eyebrow/title/linked product is editable in
   /studio, and you can upload an image to override the product photo. */
export default function FeatureDuo({
  f1Eyebrow = 'Probiotic sheet mask',
  f1Title = 'Quench & Glow, in one sheet.',
  f1Slug = 'probiotic-mask',
  f1Image = '',
  f2Eyebrow = 'Antioxidant serum',
  f2Title = 'Defend, brighten, glow.',
  f2Slug = 'antioxidant-serum',
  f2Image = '',
  ctaText = 'Learn more',
  reveal = 'on',
} = {}) {
  const products = useCatalog((s) => s.products)
  const getProduct = (slug) => products.find((p) => p.slug === slug)

  const features = [
    { eyebrow: f1Eyebrow, title: f1Title, slug: f1Slug, image: f1Image, layout: 'media-first' },
    { eyebrow: f2Eyebrow, title: f2Title, slug: f2Slug, image: f2Image, layout: 'text-first' },
  ]

  return (
    <section className="fd">
      <div className="container fd__grid">
        {features.map((f, idx) => {
          const p = getProduct(f.slug)
          const href = p ? `/product/${p.slug}` : '/shop'
          const imgSrc = f.image || p?.img
          const media = (
            <Link to={href} className="fd__media">
              <img src={imgSrc} alt={p?.name || f.title} loading="lazy" />
            </Link>
          )
          const body = (
            <div className="fd__body">
              <span className="eyebrow">{f.eyebrow}</span>
              <h3 className="fd__title">{f.title}</h3>
              <p className="fd__blurb">{p?.blurb}</p>
              <Link to={href} className="fd__btn">
                {ctaText}
              </Link>
            </div>
          )
          return (
            <article className={`fd__card fd__card--${f.layout}${reveal !== 'off' ? ' reveal' : ''}`} key={idx}>
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
