import { useEffect, useState } from 'react'
import { getActiveCampaigns } from '../lib/promoApi.js'

/* Scheduled promo banner — shows the first live banner-kind campaign as a dismissible
   top bar. The backend decides what's live (starts_at/ends_at/status); this just
   renders it. SSR-safe (fetch in effect), and never shown inside the studio editor.
   Dismissal is remembered per-campaign in localStorage so it doesn't nag. */
function isEditingContext() {
  try {
    const embed = new URLSearchParams(window.location.search).get('embed') === '1'
    return embed || (window.location.pathname || '').startsWith('/studio')
  } catch {
    return false
  }
}

export default function PromoBanner() {
  const [campaign, setCampaign] = useState(null)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined' || isEditingContext()) return
    let alive = true
    getActiveCampaigns().then((list) => {
      if (!alive) return
      const banner = list.find((c) => (c.kind === 'banner' || c.kind === 'both') && (c.message || c.code))
      if (!banner) return
      let isDismissed = false
      try { isDismissed = localStorage.getItem(`promo-dismissed-${banner.id}`) === '1' } catch { /* ignore */ }
      setCampaign(banner)
      setDismissed(isDismissed)
    })
    return () => { alive = false }
  }, [])

  if (!campaign || dismissed) return null

  const close = () => {
    setDismissed(true)
    try { localStorage.setItem(`promo-dismissed-${campaign.id}`, '1') } catch { /* ignore */ }
  }

  return (
    <div style={bar} role="region" aria-label="Promotion">
      <div style={inner}>
        <span style={{ fontWeight: 600 }}>{campaign.message || campaign.name}</span>
        {campaign.code && <span style={codePill}>{campaign.code}</span>}
        {campaign.cta_label && (
          <a href={campaign.cta_href || '/shop'} style={ctaLink}>{campaign.cta_label} →</a>
        )}
      </div>
      <button onClick={close} aria-label="Dismiss" style={closeBtn}>×</button>
    </div>
  )
}

const bar = { position: 'relative', background: '#111', color: '#fff', fontFamily: 'Manrope, sans-serif', fontSize: 14, padding: '9px 44px', textAlign: 'center' }
const inner = { display: 'inline-flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }
const codePill = { border: '1px dashed rgba(255,255,255,0.5)', borderRadius: 6, padding: '2px 8px', fontWeight: 700, letterSpacing: '0.04em' }
const ctaLink = { color: '#fff', textDecoration: 'underline', fontWeight: 600 }
const closeBtn = { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#fff', fontSize: 22, lineHeight: 1, cursor: 'pointer' }
