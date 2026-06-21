import '../styles/page-shop.css'
import { useState, useEffect, useRef } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { useCatalog } from '../store/catalog.js'
import { groups, formatPrice } from '../data/products.js'

/* Presentation-only labels for the zone dividers when "All" is shown — these map
   1:1 to the real `group` keys; no product is invented, hidden or reordered out
   of its real group. The `kind` micro-label is a crafted, per-zone descriptor
   (real category language) that replaces the generic dashed-mono eyebrow. */
const ZONE_LABELS = {
  skincare: { idx: '01', kind: 'Daily ritual', title: <>The <em>skincare</em>.</> },
  sets: { idx: '02', kind: 'Curated edits', title: <>Sets &amp; <em>bundles</em>.</> },
  tools: { idx: '03', kind: 'Hands & ritual', title: <>The <em>tools</em>.</> },
}
const ZONE_ORDER = ['skincare', 'sets', 'tools']

export default function Shop() {
  const [filter, setFilter] = useState('all')
  const first = useRef(true)
  const toolbarRef = useRef(null)

  const products = useCatalog((s) => s.products)
  const countFor = (key) =>
    key === 'all' ? products.length : products.filter((p) => p.group === key).length

  const list = filter === 'all' ? products : products.filter((p) => p.group === filter)

  // On filter change, instantly reveal the swapped-in cards (the scroll
  // observer only watches the first render).
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    document
      .querySelectorAll('.shopx-grid .reveal:not(.is-in)')
      .forEach((el) => el.classList.add('is-in'))
  }, [filter])

  // Toolbar shadow intensifies once it pins under the header (no motion).
  useEffect(() => {
    const bar = toolbarRef.current
    if (!bar || !('IntersectionObserver' in window)) return
    const sentinel = bar.previousElementSibling
    if (!sentinel) return
    const io = new IntersectionObserver(
      ([e]) => bar.classList.toggle('is-stuck', !e.isIntersecting),
      { rootMargin: '-88px 0px 0px 0px', threshold: 0 }
    )
    io.observe(sentinel)
    return () => io.disconnect()
  }, [])

  // Build the render order: when on "All", group products into real zones with a
  // divider band before each; otherwise render the filtered list flat. The
  // flagship (probiotic cleanser) opens the skincare zone as a full editorial split;
  // featured products claim wide tiles; the rest fall into the broken 4-up rhythm.
  const renderTile = (p, i) => {
    if (p.flagship) {
      return (
        <div className="shopx-tile shopx-tile--flagship reveal" key={p.id}>
          <span className="shopx-flagship__tag" aria-hidden="true">
            <span className="shopx-flagship__tag-mark" />
            The flagship
          </span>
          <div className="shopx-flagship__card">
            <ProductCard product={p} />
          </div>
          <div className="shopx-flagship__aside glass glass--strong">
            <span className="shopx-flagship__over">{p.eyebrow}</span>
            <p className="shopx-flagship__blurb">{p.blurb}</p>
            {/* SIGNATURE: a real product-spec ledger drawn straight from the data
                — type / size / price as a hairline-ruled column, no fabrication */}
            <dl className="shopx-flagship__spec">
              <div className="shopx-flagship__spec-row">
                <dt>Format</dt>
                <dd>{p.type}</dd>
              </div>
              {p.size && (
                <div className="shopx-flagship__spec-row">
                  <dt>Size</dt>
                  <dd>{p.size}</dd>
                </div>
              )}
              <div className="shopx-flagship__spec-row">
                <dt>Price</dt>
                <dd>{formatPrice(p.price)}</dd>
              </div>
            </dl>
            {p.notes?.length > 0 && (
              <div className="shopx-flagship__notes" aria-hidden="true">
                {p.notes.map((n) => (
                  <span className="shopx-flagship__note" key={n}>
                    {n}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    }

    const feature = p.featured
    return (
      <div
        className={`shopx-tile reveal ${feature ? 'shopx-tile--feature' : ''}`}
        key={p.id}
      >
        <span className="shopx-tile__idx" aria-hidden="true">
          <span className="shopx-tile__idx-slash">/</span>
          {String(i + 1).padStart(2, '0')}
        </span>
        {feature && p.eyebrow && (
          <span className="shopx-tile__ribbon glass">{p.eyebrow}</span>
        )}
        <ProductCard product={p} />
      </div>
    )
  }

  let tiles
  if (filter === 'all') {
    tiles = []
    ZONE_ORDER.forEach((key) => {
      const z = ZONE_LABELS[key]
      const inZone = products.filter((p) => p.group === key)
      if (inZone.length === 0) return
      tiles.push(
        <div className="shopx-zoneband glass" key={`band-${key}`}>
          <span className="shopx-zoneband__idx" aria-hidden="true">
            {z.idx}
          </span>
          <div className="shopx-zoneband__head">
            <span className="shopx-zoneband__kind">{z.kind}</span>
            <h2 className="shopx-zoneband__title">{z.title}</h2>
          </div>
          <span className="shopx-zoneband__count">
            {inZone.length} {inZone.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      )
      inZone.forEach((p, i) => tiles.push(renderTile(p, i)))
    })
  } else {
    tiles =
      list.length === 0 ? (
        <p className="shopx-empty">Nothing here yet — try another filter.</p>
      ) : (
        list.map((p, i) => renderTile(p, i))
      )
  }

  return (
    <div className="shopx">
      <section className="section container shopx-top">
        <h1 className="visually-hidden">Shop — the ANJOE collection</h1>

        {/* sticky-stick sentinel: when it scrolls out, the toolbar pins */}
        <div aria-hidden="true" style={{ height: 1 }} />
        <div className="shopx-toolbar" ref={toolbarRef}>
          <div className="shopx-toolbar__inner glass">
            <span className="shopx-toolbar__label">Filter</span>
            <div className="shopx-toolbar__chips" role="group" aria-label="Filter products">
              {groups.map((g) => (
                <button
                  key={g.key}
                  className={`shopx-chip ${filter === g.key ? 'is-active' : ''}`}
                  aria-pressed={filter === g.key}
                  onClick={() => setFilter(g.key)}
                >
                  {g.label}
                  <span className="shopx-chip__n">{countFor(g.key)}</span>
                </button>
              ))}
            </div>
            <span className="shopx-toolbar__count">
              <b>{list.length}</b> {list.length === 1 ? 'product' : 'products'}
            </span>
          </div>
        </div>

        <div className="shopx-grid">{tiles}</div>
      </section>
    </div>
  )
}
