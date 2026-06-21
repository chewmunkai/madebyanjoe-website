import '../styles/page-product.css'

const strs = (arr) => (Array.isArray(arr) ? arr.map((x) => (typeof x === 'string' ? x : x?.label ?? x?.text)).filter(Boolean) : [])

/* Studio preview for the shared product template copy. Shows the editable pieces
   (rating line, trust badges, assurances, info accordions, ritual heading) styled
   as they appear on a product page. The live product pages read the same published
   'product' settings. */
export default function ProductSettings(s) {
  const trust = strs(s.trust)
  const assurance = strs(s.assurance)
  const accordion = Array.isArray(s.accordion) ? s.accordion : []
  return (
    <div className="pdpx" style={{ padding: '48px 0' }}>
      <div className="container">
        <div className="pdpx-info" style={{ maxWidth: 600, margin: '0 auto' }}>
          <span className="pdpx-rating">
            <span className="pdpx-rating__stars" aria-hidden="true">★★★★★</span>
            <em>{s.ratingText}</em>
          </span>
          <div className="pdpx-trust glass">
            {trust.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <ul className="pdpx-assure glass">
            {assurance.map((a) => (
              <li key={a}>
                <span className="pdpx-assure__ic" aria-hidden="true" /> {a}
              </li>
            ))}
          </ul>
          <div className="pdpx-acc glass">
            {accordion.map((it, i) => (
              <details key={it.q || i} open>
                <summary>
                  <span>
                    <span className="pdpx-acc__idx">{String(i + 1).padStart(2, '0')}</span>{it.q}
                  </span>
                </summary>
                <p>{it.a}</p>
              </details>
            ))}
          </div>
          <h2 style={{ marginTop: 32 }}>
            {s.ritualTitleA}<em>{s.ritualTitleEm}</em>{s.ritualTitleB}
          </h2>
        </div>
      </div>
    </div>
  )
}
