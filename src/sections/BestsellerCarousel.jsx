import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../store/cart.js'
import { getProduct, formatPrice } from '../data/products.js'

/* Sample social-proof ratings — replace with real review data. */
const RATING = {
  'probiotic-amino-cleanser': [4.9, 214],
  'essence-water': [4.9, 192],
  'antioxidant-serum': [4.8, 167],
  'barrier-repair-cream': [4.8, 121],
  'probiotic-mask': [4.9, 143],
  'mugwort-treatment-oil': [4.7, 88],
  'barrier-repair-combo': [4.9, 64],
}
const BESTSELLERS = Object.keys(RATING)

function Stars({ value }) {
  return (
    <span className="bc__stars" role="img" aria-label={`${value} out of 5`}>
      <span className="bc__stars-base">★★★★★</span>
      <span className="bc__stars-fill" style={{ width: `${(value / 5) * 100}%` }}>
        ★★★★★
      </span>
    </span>
  )
}

export default function BestsellerCarousel() {
  const track = useRef(null)
  const add = useCart((s) => s.add)
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: 0 })

  const onDown = (e) => {
    const t = track.current
    drag.current = { down: true, startX: e.clientX, startScroll: t.scrollLeft, moved: 0 }
    t.classList.add('is-dragging')
  }
  const onMove = (e) => {
    if (!drag.current.down) return
    const dx = e.clientX - drag.current.startX
    drag.current.moved = Math.abs(dx)
    track.current.scrollLeft = drag.current.startScroll - dx
  }
  const onUp = () => {
    drag.current.down = false
    track.current?.classList.remove('is-dragging')
  }
  /* Suppress the click that follows a real drag so cards don't navigate. */
  const onClickCapture = (e) => {
    if (drag.current.moved > 6) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
  const nudge = (dir) => {
    const t = track.current
    const card = t.querySelector('.bc__card')
    const step = card ? card.offsetWidth + 24 : 360
    t.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <section className="bc">
      <div className="container bc__head">
        <div>
          <span className="eyebrow">Loved & repurchased</span>
          <h2 className="reveal">The bestsellers.</h2>
        </div>
        <div className="bc__nav">
          <button className="bc__arrow" aria-label="Previous" onClick={() => nudge(-1)}>
            ←
          </button>
          <button className="bc__arrow" aria-label="Next" onClick={() => nudge(1)}>
            →
          </button>
          <Link to="/shop" className="textlink bc__all">
            View all →
          </Link>
        </div>
      </div>

      <div
        className="bc__track"
        ref={track}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onClickCapture={onClickCapture}
      >
        {BESTSELLERS.map((slug, n) => {
          const p = getProduct(slug)
          const [rating, count] = RATING[slug]
          return (
            <article className="bc__card" key={slug}>
              <Link to={`/product/${p.slug}`} className="bc__media" draggable="false">
                <img src={p.img} alt={p.name} loading="lazy" draggable="false" />
                <button
                  className="bc__add"
                  onClick={(e) => {
                    e.preventDefault()
                    add(p)
                  }}
                >
                  Add to bag
                </button>
              </Link>
              <div className="bc__info">
                <span className="bc__cat">№ {String(n + 1).padStart(2, '0')} · {p.type}</span>
                <Link to={`/product/${p.slug}`} className="bc__name">
                  {p.name}
                </Link>
                <div className="bc__rate">
                  <Stars value={rating} />
                  <span className="bc__count">
                    {rating} ({count})
                  </span>
                </div>
                <div className="bc__price">
                  <span className="bc__now">{formatPrice(p.price)}</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
