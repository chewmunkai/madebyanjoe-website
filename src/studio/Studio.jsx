import { useEffect, useState } from 'react'
import { Puck, usePuck } from '@measured/puck'
import '@measured/puck/puck.css'
import { config } from './homepage.config.jsx'
import { defaultHomepage, HOME_SLUG, normalizeLayout } from './homepage.js'
import {
  getAdminToken, adminLogin, clearAdminToken,
  getDraft, saveDraft, publishLayout,
} from '../lib/builderApi.js'

const FONT = 'Manrope, system-ui, sans-serif'

/* Visual homepage editor, gated behind a Medusa admin login. Loads the saved draft,
   lets you reorder/edit, then Save draft (private) or Publish (live). Everything
   persists to the Medusa page_builder module — no localStorage. */
export default function Studio() {
  const [token, setToken] = useState(getAdminToken())
  const [data, setData] = useState(null) // null = still loading the draft
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!token) return
    let alive = true
    getDraft(HOME_SLUG)
      .then((r) => { if (alive) setData(normalizeLayout(r.draft || r.published)) })
      .catch((e) => {
        if (!alive) return
        if (e.status === 401) { clearAdminToken(); setToken(null) }
        else { setData(defaultHomepage); setNote('Could not load the saved layout — starting from the current homepage.') }
      })
    return () => { alive = false }
  }, [token])

  if (!token) return <LoginScreen onAuthed={setToken} />
  if (!data) return <Centered>Loading homepage…</Centered>

  return (
    <div style={{ height: '100vh' }}>
      <Puck
        config={config}
        data={data}
        headerTitle="ANJOE — Edit homepage"
        onPublish={async (d) => {
          try {
            await publishLayout(HOME_SLUG, d)
            window.open('/', '_blank')
          } catch (e) {
            alert('Publish failed: ' + e.message)
          }
        }}
        overrides={{
          headerActions: ({ children }) => (
            <>
              <SaveDraftButton />
              {children}
            </>
          ),
        }}
      />
      {note && <Toast>{note}</Toast>}
    </div>
  )
}

/* "Save draft" persists the current editor state privately (it does NOT go live).
   usePuck() reads exactly what's on screen right now. */
function SaveDraftButton() {
  const { appState } = usePuck()
  const [state, setState] = useState('idle') // idle | saving | saved | error
  const label = state === 'saving' ? 'Saving…' : state === 'saved' ? 'Draft saved ✓' : state === 'error' ? 'Save failed' : 'Save draft'
  return (
    <button
      type="button"
      onClick={async () => {
        setState('saving')
        try { await saveDraft(HOME_SLUG, appState.data); setState('saved'); setTimeout(() => setState('idle'), 2000) }
        catch { setState('error'); setTimeout(() => setState('idle'), 2500) }
      }}
      style={{ marginRight: 8, padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', font: `500 14px ${FONT}`, cursor: 'pointer' }}
    >
      {label}
    </button>
  )
}

function LoginScreen({ onAuthed }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  async function submit(e) {
    e.preventDefault()
    setBusy(true); setErr('')
    try { const t = await adminLogin(email.trim(), password); onAuthed(t) }
    catch (ex) { setErr(ex.message) }
    finally { setBusy(false) }
  }
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#faf9f7', font: `400 15px ${FONT}` }}>
      <form onSubmit={submit} style={{ width: 320, padding: 28, background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,.08)' }}>
        <h1 style={{ margin: '0 0 4px', font: `600 20px ${FONT}` }}>ANJOE Studio</h1>
        <p style={{ margin: '0 0 20px', color: '#888', fontSize: 13 }}>Sign in to edit your homepage.</p>
        <label style={lbl}>Email</label>
        <input style={inp} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        <label style={lbl}>Password</label>
        <input style={inp} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        {err && <div style={{ color: '#c0392b', fontSize: 13, marginTop: 10 }}>{err}</div>}
        <button type="submit" disabled={busy} style={{ marginTop: 18, width: '100%', padding: '11px 0', borderRadius: 10, border: 0, background: '#111', color: '#fff', font: `600 15px ${FONT}`, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1 }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

const lbl = { display: 'block', fontSize: 12, color: '#666', margin: '12px 0 5px' }
const inp = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 9, border: '1px solid #e2e0db', font: `400 14px ${FONT}`, outline: 'none' }

function Centered({ children }) {
  return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', font: `400 15px ${FONT}`, color: '#666' }}>{children}</div>
}
function Toast({ children }) {
  return <div style={{ position: 'fixed', bottom: 16, left: 16, background: '#111', color: '#fff', padding: '10px 14px', borderRadius: 10, font: `400 13px ${FONT}`, maxWidth: 360 }}>{children}</div>
}
