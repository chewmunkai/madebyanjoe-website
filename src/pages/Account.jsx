import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCustomer, getOrders, getPoints, logout, isLoggedIn } from '../lib/customerApi.js'

/* Member account — profile + order history. Points + affiliate sections are stubbed
   here and filled in by Wave 2 (loyalty) and Wave 3 (affiliate). Light styling for now. */
export default function Account() {
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [orders, setOrders] = useState([])
  const [points, setPoints] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return }
    let alive = true
    ;(async () => {
      try {
        const c = await getCustomer()
        if (!c) { navigate('/login'); return }
        const o = await getOrders().catch(() => [])
        const pts = await getPoints().catch(() => null)
        if (alive) { setCustomer(c); setOrders(o); setPoints(pts) }
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
        {/* Wave 3 fills this from the affiliate module */}
        <Card label="Referral earnings"><span style={{ color: '#999' }}>Coming soon</span></Card>
      </div>

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
