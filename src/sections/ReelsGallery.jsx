import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../store/cart.js'
import { getProduct, formatPrice } from '../data/products.js'

/* @madebyanjoe video gallery. Top tier: shoppable YouTube features (hover
   reveals the product, like Torriden's UGC). Bottom tier: a rail of the brand's
   real Instagram reels, embedded straight from instagram.com. */
const videos = [
  { id: 'NHoRI6BIun8', title: 'HydraGlow Combo', slug: 'hydraglow-combo' },
  { id: 'WnluJXC215Y', title: 'Skin Activating Combo', slug: 'skin-activating-combo' },
  { id: 'bjn2UrUF5Sw', title: 'Lymphatic Drainage Brush', slug: 'cellulite-massager' },
]

/* Real reel shortcodes from instagram.com/madebyanjoe */
const reels = [
  'DCO2T2LSdOe',
  'DG5jIfPS6AF',
  'DE41RXbShg6',
  'C7MO2Mvxzr4',
  'C_soITryuE7',
  'C6bCXXVxh5N',
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
          <button className="reel__btn" onClick={() => setPlay(true)} aria-label={`Play ${title}`}>
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={title} loading="lazy" />
            <span className="reel__play" aria-hidden="true">▶</span>
            <span className="reel__tag">@madebyanjoe</span>
          </button>
        )}
        {/* hover-to-shop overlay — only before play */}
        {!play && product && (
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
      </div>

      <p className="reel__cap">{title}</p>
    </article>
  )
}

function IgReel({ id }) {
  return (
    <a
      className="igreel"
      href={`https://www.instagram.com/reel/${id}/`}
      target="_blank"
      rel="noreferrer"
      aria-label="Watch this reel on Instagram"
    >
      <img className="igreel__cover" src={`${import.meta.env.BASE_URL}reels/${id}.jpg`} alt="ANJOE Instagram reel" loading="lazy" />
      <span className="igreel__play" aria-hidden="true">▶</span>
      <span className="igreel__tag">@madebyanjoe</span>
    </a>
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

      {/* Tier 1 — shoppable YouTube features (asymmetric) */}
      <div className="container reels__feature">
        <div className="reels__main reveal">
          <VideoCard {...videos[0]} />
        </div>
        <div className="reels__side">
          <VideoCard {...videos[1]} />
          <VideoCard {...videos[2]} />
        </div>
      </div>

      {/* Tier 2 — real Instagram reels */}
      <div className="container reels__ig">
        <div className="reels__ig-head">
          <span className="eyebrow">On Instagram</span>
          <p className="reels__ig-sub">
            Real reels from the @madebyanjoe community — tap any to watch.
          </p>
        </div>
        <div className="reels__ig-rail">
          {reels.map((id) => (
            <IgReel key={id} id={id} />
          ))}
        </div>
      </div>
    </section>
  )
}
