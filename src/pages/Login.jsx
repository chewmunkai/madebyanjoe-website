import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, register } from '../lib/customerApi.js'

/* Member sign-in / sign-up. Uses Medusa v2 customer auth (customerApi). On success
   it routes to /account. Styling is intentionally light + on-brand (Manrope), to be
   refined in the storefront design pass / the Vike migration. */
export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      if (mode === 'login') await login(form.email, form.password)
      else await register(form)
      navigate('/account')
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section style={wrap}>
      <div style={card}>
        <h1 style={title}>{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
        <p style={sub}>
          {mode === 'login' ? 'Welcome back.' : 'Join to track orders, earn points, and more.'}
        </p>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, marginTop: 18 }}>
          {mode === 'register' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input style={input} placeholder="First name" value={form.first_name} onChange={set('first_name')} autoComplete="given-name" />
              <input style={input} placeholder="Last name" value={form.last_name} onChange={set('last_name')} autoComplete="family-name" />
            </div>
          )}
          <input style={input} type="email" required placeholder="Email" value={form.email} onChange={set('email')} autoComplete="email" />
          <input style={input} type="password" required placeholder="Password" value={form.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />

          {error && <div style={errBox}>{error}</div>}

          <button type="submit" disabled={busy} style={{ ...btn, opacity: busy ? 0.6 : 1 }}>
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => { setError(''); setMode(mode === 'login' ? 'register' : 'login') }}
          style={toggle}
        >
          {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}
        </button>

        <Link to="/" style={{ ...toggle, display: 'block', marginTop: 6 }}>← Back to store</Link>
      </div>
    </section>
  )
}

const wrap = { minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '120px 20px 80px', fontFamily: 'Manrope, sans-serif' }
const card = { width: '100%', maxWidth: 420 }
const title = { fontSize: 28, fontWeight: 600, margin: 0 }
const sub = { color: '#666', margin: '8px 0 0' }
const input = { width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: 10, fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box' }
const btn = { padding: '13px 16px', border: 'none', borderRadius: 10, background: '#111', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }
const toggle = { background: 'none', border: 'none', color: '#111', textDecoration: 'underline', cursor: 'pointer', fontSize: 14, padding: 0, marginTop: 14, fontFamily: 'inherit' }
const errBox = { background: '#fdecea', color: '#b3261e', padding: '10px 12px', borderRadius: 8, fontSize: 14 }
