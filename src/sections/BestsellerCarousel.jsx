import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../store/cart.js'
import { useCatalog } from '../store/catalog.js'
import { formatPrice } from '../data/products.js'

/* The bestseller list is editable in /studio (add/remove/reorder products + set their
   rating). Each item links to a real product by slug; defaults below = the current set. */
const DEFAULT_PRODUCTS = [
  { slug: 'probiotic-amino-cleanser', rating: 4.9, count: 214 },
  { slug: 'essence-water', rating: 4.9, count: 192 },
  { slug: 'antioxidant-serum', rating: 4.8, count: 167 },
  { slug: 'barrier-repair-cream', rating: 4.8, count: 121 },
  { slug: 'probiotic-mask', rating: 4.9, count: 143 },
  { slug: 'mugwort-treatment-oil', rating: 4.7, count: 88 },
  { slug: 'barrier-repair-combo', rating: 4.9, count: 64 },
]

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

export default function BestsellerCarousel({
  eyebrow = 'Loved & repurchased',
  title = 'The bestsellers.',
  viewAllText = 'View all →',
  viewAllHref = '/shop',
  reveal = 'on',
  products: items = DEFAULT_PRODUCTS,
} = {}) {
  const track = useRef(null)
  const add = useCart((s) => s.add)
  const products = useCatalog((s) => s.products)
  const getProduct = (slug) => products.find((p) => p.slug === slug)
  const list = Array.isArray(items) && items.length ? items : DEFAULT_PRODUCTS
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
          <span className="eyebrow">{eyebrow}</span>
          <h2 className={reveal !== 'off' ? 'reveal' : undefined}>{title}</h2>
        </div>
        <div className="bc__nav">
          <button className="bc__arrow" aria-label="Previous" onClick={() => nudge(-1)}>
            ←
          </button>
          <button className="bc__arrow" aria-label="Next" onClick={() => nudge(1)}>
            →
          </button>
          <Link to={viewAllHref} className="textlink bc__all">
            {viewAllText}
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
        {list.map((item, n) => {
          const p = getProduct(item.slug)
          if (!p) return null
          const rating = Number(item.rating) || 0
          const count = item.count
          return (
            <article className="bc__card" key={item.slug + n}>
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
