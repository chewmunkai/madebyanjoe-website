import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCustomer, getOrders, getPoints, getReferral, getAffiliate, logout, isLoggedIn } from '../lib/customerApi.js'

/* Member account — profile, order history, points, refer-a-friend, affiliate dashboard.
   Each data section degrades to null if its module isn't live, so the page never breaks. */
export default function Account() {
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [orders, setOrders] = useState([])
  const [points, setPoints] = useState(null)
  const [referral, setReferral] = useState(null)
  const [affiliate, setAffiliate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return }
    let alive = true
    ;(async () => {
      try {
        const c = await getCustomer()
        if (!c) { navigate('/login'); return }
        const [o, pts, ref, aff] = await Promise.all([
          getOrders().catch(() => []),
          getPoints().catch(() => null),
          getReferral().catch(() => null),
          getAffiliate().catch(() => null),
        ])
        if (alive) { setCustomer(c); setOrders(o); setPoints(pts); setReferral(ref); setAffiliate(aff) }
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [navigate])

  function onLogout() { logout(); navigate('/') }

  if (loading) return <section style={wrap}><p style={{ color: '#666' }}>Loading…</p></section>
  if (!customer) return null

  return (
    <section style={wrap}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={title}>Hi {customer.first_name || customer.email}</h1>
        <button onClick={onLogout} style={linkBtn}>Sign out</button>
      </div>

      <div style={grid}>
        <Card label="Email">{customer.email}</Card>
        <Card label="Points balance">
          {points ? `${points.balance} pts` : <span style={{ color: '#999' }}>0 pts</span>}
        </Card>
        <Card label="Referral points earned">
          {referral ? `${referral.points_earned} pts` : <span style={{ color: '#999' }}>0 pts</span>}
        </Card>
      </div>

      {referral && <ReferCard referral={referral} />}
      {affiliate && <AffiliateCard affiliate={affiliate} />}

      <h2 style={h2}>Order history</h2>
      {orders.length === 0 ? (
        <p style={{ color: '#666' }}>No orders yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {orders.map((o) => (
            <div key={o.id} style={orderRow}>
              <div>
                <div style={{ fontWeight: 600 }}>#{o.display_id ?? o.id?.slice(-6)}</div>
                <div style={{ color: '#888', fontSize: 13 }}>{formatDate(o.created_at)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600 }}>{formatMoney(o.total, o.currency_code)}</div>
                <div style={{ color: '#888', fontSize: 13, textTransform: 'capitalize' }}>{o.status || o.fulfillment_status || ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function Card({ label, children }) {
  return (
    <div style={card}>
      <div style={{ color: '#888', fontSize: 13, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600 }}>{children}</div>
    </div>
  )
}

function fullLink(path) {
  try { return `${window.location.origin}${path}` } catch { return path }
}

function CopyLink({ link }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    try {
      navigator.clipboard?.writeText(link)
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    } catch { /* ignore */ }
  }
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 10 }}>
      <code style={linkBox}>{link}</code>
      <button onClick={copy} style={copyBtn}>{copied ? 'Copied ✓' : 'Copy'}</button>
    </div>
  )
}

/* Refer-a-friend: share the link; both you and your friend earn points on their first order. */
function ReferCard({ referral }) {
  const link = fullLink(referral.share_path)
  const cfg = referral.config || {}
  return (
    <div style={panel}>
      <h2 style={{ ...h2, marginTop: 0 }}>Refer a friend</h2>
      <p style={{ color: '#555', margin: '0 0 4px', fontSize: 14 }}>
        Share your link. When a friend places their first order, you both get{' '}
        <strong>{cfg.friend_reward ?? 500} points</strong>.
      </p>
      <CopyLink link={link} />
      <div style={statRow}>
        <span>Friends referred: <strong>{referral.referrals_rewarded}</strong></span>
        <span>Points earned: <strong>{referral.points_earned}</strong></span>
      </div>
    </div>
  )
}

/* Affiliate dashboard: commission link + pending/approved/paid earnings. Only shown to
   customers who are enrolled affiliates (the endpoint returns null otherwise). */
function AffiliateCard({ affiliate }) {
  const link = affiliate.link || fullLink(`/?ref=${affiliate.code}`)
  const money = (v) => formatMoney(v ?? 0, affiliate.currency || 'myr')
  return (
    <div style={panel}>
      <h2 style={{ ...h2, marginTop: 0 }}>Affiliate dashboard</h2>
      <p style={{ color: '#555', margin: '0 0 4px', fontSize: 14 }}>
        Earn <strong>{Math.round((affiliate.commission_rate ?? 0) * 100)}%</strong> commission on orders from your link.
        Status: <strong style={{ textTransform: 'capitalize' }}>{affiliate.status || 'active'}</strong>.
      </p>
      <CopyLink link={link} />
      <div style={statRow}>
        <span>Pending: <strong>{money(affiliate.pending)}</strong></span>
        <span>Approved: <strong>{money(affiliate.approved)}</strong></span>
        <span>Paid: <strong>{money(affiliate.paid)}</strong></span>
      </div>
    </div>
  )
}

function formatDate(s) { try { return new Date(s).toLocaleDateString() } catch { return '' } }
function formatMoney(v, cc) {
  if (v == null) return ''
  try { return new Intl.NumberFormat('en-MY', { style: 'currency', currency: (cc || 'myr').toUpperCase() }).format(v) }
  catch { return `${(cc || 'RM').toUpperCase()} ${v}` }
}

const wrap = { maxWidth: 820, margin: '0 auto', padding: '120px 20px 100px', fontFamily: 'Manrope, sans-serif' }
const title = { fontSize: 30, fontWeight: 600, margin: 0 }
const h2 = { fontSize: 20, fontWeight: 600, margin: '40px 0 16px' }
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginTop: 24 }
const card = { border: '1px solid #eee', borderRadius: 12, padding: '16px 18px' }
const orderRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #eee', borderRadius: 12, padding: '14px 18px' }
const linkBtn = { background: 'none', border: 'none', color: '#111', textDecoration: 'underline', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }
const panel = { border: '1px solid #eee', borderRadius: 14, padding: '20px 22px', marginTop: 28, background: '#fafafa' }
const linkBox = { background: '#fff', border: '1px solid #e2e2e2', borderRadius: 8, padding: '8px 12px', fontSize: 13, wordBreak: 'break-all', flex: '1 1 240px' }
const copyBtn = { background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }
const statRow = { display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 14, color: '#444', fontSize: 14 }
