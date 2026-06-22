import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCampaignForSlug } from '../lib/promoApi.js'

/* Temporary promo landing page — /promo/:slug. Rendered only while its campaign is
   live (the backend gates on starts_at/ends_at/status); outside the window it shows a
   tidy "ended" state instead of a broken page. Content (headline, copy, image, CTA,
   code) is operator-editable from the admin Promo Campaigns page. */
export default function PromoPage() {
  const { slug } = useParams()
  const [state, setState] = useState({ loading: true, campaign: null })

  useEffect(() => {
    let alive = true
    setState({ loading: true, campaign: null })
    getCampaignForSlug(slug).then((c) => { if (alive) setState({ loading: false, campaign: c }) })
    return () => { alive = false }
  }, [slug])

  if (state.loading) return <section style={wrap}><p style={{ color: '#888' }}>Loading…</p></section>

  if (!state.campaign) {
    return (
      <section style={wrap}>
        <h1 style={h1}>This promotion has ended</h1>
        <p style={{ color: '#666' }}>The offer you’re looking for isn’t running right now.</p>
        <a href="/shop" style={cta}>Continue shopping →</a>
      </section>
    )
  }

  const c = state.campaign
  return (
    <section style={{ ...wrap, textAlign: 'center' }}>
      {c.image_url && <img src={c.image_url} alt="" style={hero} />}
      <h1 style={h1}>{c.name}</h1>
      {c.message && <p style={lead}>{c.message}</p>}
      {c.code && (
        <div style={codeWrap}>
          <span style={{ color: '#888', fontSize: 13 }}>Use code</span>
          <span style={codePill}>{c.code}</span>
        </div>
      )}
      <a href={c.cta_href || '/shop'} style={cta}>{c.cta_label || 'Shop the offer'} →</a>
    </section>
  )
}

const wrap = { maxWidth: 760, margin: '0 auto', padding: '140px 20px 120px', fontFamily: 'Manrope, sans-serif' }
const hero = { width: '100%', borderRadius: 16, marginBottom: 28, objectFit: 'cover' }
const h1 = { fontSize: 38, fontWeight: 600, margin: '0 0 14px' }
const lead = { fontSize: 18, color: '#444', lineHeight: 1.6, margin: '0 0 24px' }
const codeWrap = { display: 'inline-flex', gap: 10, alignItems: 'center', margin: '0 0 28px' }
const codePill = { border: '2px dashed #111', borderRadius: 8, padding: '6px 14px', fontWeight: 700, letterSpacing: '0.06em', fontSize: 18 }
const cta = { display: 'inline-block', background: '#111', color: '#fff', textDecoration: 'none', padding: '14px 28px', borderRadius: 10, fontWeight: 600 }
