import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../store/cart.js'
import { getProduct, formatPrice } from '../data/products.js'

/* @madebyanjoe video gallery — real brand videos (Instagram is login-gated, so
   these come from the brand's YouTube). Each video is shoppable: hover reveals
   the featured product with an add-to-bag, like Torriden's UGC. Click to play. */
const videos = [
  { id: 'NHoRI6BIun8', title: 'HydraGlow Combo', slug: 'hydraglow-combo' },
  { id: 'WnluJXC215Y', title: 'Skin Activating Combo', slug: 'skin-activating-combo' },
  { id: 'bjn2UrUF5Sw', title: 'Lymphatic Drainage Brush', slug: 'cellulite-massager' },
]

function VideoCard({ id, title, slug }) {
  const [play, setPlay] = useState(false)
  const add = useCart((s) => s.add)
  const product = getProduct(slug)

  return (
    <article className="reel">
      <div className="reel__media">
        {play ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <button className="reel__btn" onClick={() => setPlay(true)} aria-label={`Play ${title}`}>
              <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={title} loading="lazy" />
              <span className="reel__play" aria-hidden="true">▶</span>
              <span className="reel__tag">@madebyanjoe</span>
            </button>
            {product && (
              <div className="reel__shop">
                <Link to={`/product/${product.slug}`} className="reel__shop-media" aria-label={product.name}>
                  <img src={product.img} alt={product.name} loading="lazy" />
                </Link>
                <Link to={`/product/${product.slug}`} className="reel__shop-info">
                  <span className="reel__shop-name">{product.name}</span>
                  <span className="reel__shop-price">{formatPrice(product.price)}</span>
                </Link>
                <button
                  className="reel__shop-add"
                  onClick={() => add(product)}
                  aria-label={`Add ${product.name} to bag`}
                >
                  +
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <p className="reel__cap">{title}</p>
    </article>
  )
}

export default function ReelsGallery() {
  return (
    <section className="reels">
      <div className="container reels__head">
        <span className="eyebrow">Watch the ritual</span>
        <div className="reels__row">
          <h2 className="reveal">@madebyanjoe</h2>
          <a
            className="textlink"
            href="https://www.instagram.com/madebyanjoe/"
            target="_blank"
            rel="noreferrer"
          >
            Follow the ritual →
          </a>
        </div>
      </div>
      <div className="container reels__grid">
        {videos.map((v) => (
          <VideoCard key={v.id} {...v} />
        ))}
      </div>
    </section>
  )
}
