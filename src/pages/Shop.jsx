import { useState, useEffect, useRef } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { products, groups } from '../data/products.js'

export default function Shop() {
  const [filter, setFilter] = useState('all')
  const first = useRef(true)
  const list = filter === 'all' ? products : products.filter((p) => p.group === filter)

  // On filter change, instantly reveal the swapped-in cards (the scroll
  // observer only watches the first render).
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    document
      .querySelectorAll('.shop__grid .reveal:not(.is-in)')
      .forEach((el) => el.classList.add('is-in'))
  }, [filter])

  return (
    <>
      <header className="page-hero">
        <div className="page-hero__wash" />
        <div className="container">
          <span className="eyebrow">Shop</span>
          <h1>The Collection</h1>
          <p className="lede">
            Every formula and tool in the ANJOE ritual — barrier-first,
            plant-based, made in Malaysia.
          </p>
        </div>
      </header>

      <section className="section container">
        <div className="shop__filters">
          {groups.map((g) => (
            <button
              key={g.key}
              className={`chip ${filter === g.key ? 'is-active' : ''}`}
              onClick={() => setFilter(g.key)}
            >
              {g.label}
            </button>
          ))}
          <span className="shop__count">{list.length} products</span>
        </div>

        <div className="grid grid--4 shop__grid">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  )
}
