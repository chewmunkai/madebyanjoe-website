import { useEffect, useState } from 'react'
import { getActiveCampaigns } from '../lib/promoApi.js'

/* Scheduled promo banner — shows the first live banner-kind campaign as a large,
   dismissible overlay covering ~70% of the screen (centered over a dimmed backdrop),
   instead of a thin top bar. When the campaign has an image_url (the client's designed
   creative), the image IS the banner — shown full / uncropped, up to 70vh tall and
   ~900px wide, and clicking it follows the CTA. Otherwise a text card is shown as a
   fallback. The backend owns the schedule (starts_at/ends_at/status); this just renders
   what's live, SSR-safe, never inside the studio editor, and remembers dismissal per
   campaign in localStorage.
   Preview the layout without a live campaign: ?promo_preview=1 (image) or ?promo_preview=text. */
function isEditingContext() {
  try {
    const embed = new URLSearchParams(window.location.search).get('embed') === '1'
    return embed || (window.location.pathname || '').startsWith('/studio')
  } catch {
    return false
  }
}

const PREVIEW_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1350'><rect width='1080' height='1350' fill='%23221b12'/><text x='540' y='620' fill='%23ffffff' font-family='Georgia,serif' font-size='86' text-anchor='middle'>Banner image</text><text x='540' y='720' fill='rgba(255,255,255,0.6)' font-family='sans-serif' font-size='42' text-anchor='middle'>client artwork · 4:5 · 1080×1350</text></svg>`
  )

function previewCampaign() {
  try {
    const mode = new URLSearchParams(window.location.search).get('promo_preview')
    if (mode === '1' || mode === 'image') {
      return { id: 'preview', image_url: PREVIEW_IMG, cta_href: '/shop', message: 'Raya promotion' }
    }
    if (mode === 'text') {
      return { id: 'preview', message: 'Raya — Everything Free', code: 'RAYA', cta_label: 'Shop the edit', cta_href: '/shop' }
    }
  } catch { /* ignore */ }
  return null
}

export default function PromoBanner() {
  const [campaign, setCampaign] = useState(null)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined' || isEditingContext()) return

    const preview = previewCampaign()
    if (preview) {
      setCampaign(preview)
      setDismissed(false)
      return
    }

    let alive = true
    getActiveCampaigns().then((list) => {
      if (!alive) return
      const banner = list.find((c) => (c.kind === 'banner' || c.kind === 'both') && (c.image_url || c.message || c.code))
      if (!banner) return
      let isDismissed = false
      try { isDismissed = localStorage.getItem(`promo-dismissed-${banner.id}`) === '1' } catch { /* ignore */ }
      setCampaign(banner)
      setDismissed(isDismissed)
    })
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (!campaign || dismissed) return
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign, dismissed])

  if (!campaign || dismissed) return null

  const close = () => {
    setDismissed(true)
    try { localStorage.setItem(`promo-dismissed-${campaign.id}`, '1') } catch { /* ignore */ }
  }

  const hasImage = !!campaign.image_url

  return (
    <div style={overlay} role="dialog" aria-modal="true" aria-label="Promotion" onClick={close}>
      <div style={hasImage ? imageFrame : card} onClick={(e) => e.stopPropagation()}>
        <button onClick={close} aria-label="Dismiss" style={hasImage ? closeBtnOnImage : closeBtn}>×</button>

        {hasImage ? (
          <a href={campaign.cta_href || '/shop'} style={imageLink} onClick={close} aria-label={campaign.message || campaign.name || 'Shop the promotion'}>
            <img src={campaign.image_url} alt={campaign.message || campaign.name || 'Promotion'} style={image} />
          </a>
        ) : (
          <>
            <div style={eyebrow}>Limited offer</div>
            <h2 style={headline}>{campaign.message || campaign.name}</h2>
            {campaign.code && (
              <div style={codeRow}>
                <span style={codeLabel}>Use code</span>
                <span style={codePill}>{campaign.code}</span>
              </div>
            )}
            <a href={campaign.cta_href || '/shop'} style={ctaBtn} onClick={close}>
              {campaign.cta_label || 'Shop now'}
            </a>
          </>
        )}
      </div>
    </div>
  )
}

const overlay = {
  position: 'fixed', inset: 0, zIndex: 9999,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '24px',
  background: 'rgba(10,10,12,0.62)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
  fontFamily: 'Manrope, sans-serif',
}

// Image banner: the creative is shown full (never cropped), sized to ~70% of the screen.
const imageFrame = { position: 'relative', display: 'inline-flex', borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.55)' }
const imageLink = { display: 'block', lineHeight: 0 }
const image = { display: 'block', height: '70vh', maxHeight: '860px', width: 'auto', maxWidth: 'min(92vw, 900px)', objectFit: 'contain' }
const closeBtnOnImage = { position: 'absolute', right: 10, top: 8, zIndex: 2, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', border: 'none', color: '#fff', fontSize: 24, lineHeight: 1, cursor: 'pointer' }

// Text fallback (no image set on the campaign).
const card = {
  position: 'relative',
  width: 'min(92vw, 760px)', height: '70vh', maxHeight: '760px',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22,
  textAlign: 'center', padding: 'clamp(28px, 6vw, 72px)',
  background: 'linear-gradient(160deg, #16140f 0%, #2a2118 55%, #4a3a26 100%)',
  color: '#fff', borderRadius: 20,
  boxShadow: '0 40px 120px rgba(0,0,0,0.55)', overflow: 'auto',
}
const eyebrow = { textTransform: 'uppercase', letterSpacing: '0.32em', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)' }
const headline = { margin: 0, fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif", fontWeight: 600, lineHeight: 1.05, fontSize: 'clamp(34px, 6vw, 64px)' }
const codeRow = { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }
const codeLabel = { fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }
const codePill = { border: '1px dashed rgba(255,255,255,0.55)', borderRadius: 8, padding: '8px 18px', fontWeight: 800, letterSpacing: '0.12em', fontSize: 20 }
const ctaBtn = { marginTop: 6, background: '#fff', color: '#1a140d', textDecoration: 'none', fontWeight: 700, fontSize: 16, padding: '15px 40px', borderRadius: 999, letterSpacing: '0.02em' }
const closeBtn = { position: 'absolute', right: 18, top: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)', fontSize: 34, lineHeight: 1, cursor: 'pointer' }
