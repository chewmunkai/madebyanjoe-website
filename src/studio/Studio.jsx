import { useEffect, useState } from 'react'
import { Puck, usePuck } from '@measured/puck'
import '@measured/puck/puck.css'
import { PAGES, layoutOr } from './pages.js'
import {
  getAdminToken, adminLogin, clearAdminToken,
  getDraft, saveDraft, publishLayout, isEmbeddedStudio, getStudioTicket,
} from '../lib/builderApi.js'

const FONT = 'Manrope, system-ui, sans-serif'

function initialPageKey() {
  const p = new URLSearchParams(window.location.search).get('page')
  return PAGES[p] ? p : 'home'
}

/* Multi-page visual editor, gated behind a Medusa admin login. Switch between pages
   (Homepage / About), edit content + composition + media + animation, then Save draft
   (private) or Publish (live). Everything persists to the Medusa page_builder module. */
export default function Studio() {
  // Opened from the Medusa admin's Theme Editor → a ticket replaces admin login.
  const embedded = isEmbeddedStudio()
  const [token, setToken] = useState(embedded ? 'ticket' : getAdminToken())
  const [pageKey, setPageKey] = useState(initialPageKey)
  const [data, setData] = useState(null) // null = loading this page's draft
  const [note, setNote] = useState('')
  const page = PAGES[pageKey]

  useEffect(() => {
    if (!token) return
    let alive = true
    setData(null)
    getDraft(page.slug)
      .then((r) => { if (alive) setData(layoutOr(r.draft || r.published, page.defaultLayout)) })
      .catch((e) => {
        if (!alive) return
        if (e.status === 401 && !embedded) { clearAdminToken(); setToken(null) }
        else {
          setData(page.defaultLayout)
          setNote(embedded
            ? 'Editing session expired — reopen the Theme Editor from the admin.'
            : 'Could not load the saved layout — starting from the current page.')
        }
      })
    return () => { alive = false }
  }, [token, pageKey, page.slug, page.defaultLayout])

  if (!token) return <LoginScreen onAuthed={setToken} />
  if (!data) return <Centered>Loading {page.label}…</Centered>

  return (
    <div style={{ height: '100vh' }}>
      <Puck
        key={pageKey}
        config={page.config}
        data={data}
        headerTitle={`ANJOE — Edit ${page.label}`}
        onPublish={async (d) => {
          try {
            await publishLayout(page.slug, d)
            window.open(page.path, '_blank')
          } catch (e) {
            alert('Publish failed: ' + e.message)
          }
        }}
        overrides={{
          headerActions: ({ children }) => (
            <>
              <PageSwitcher current={pageKey} onSwitch={setPageKey} />
              <SaveDraftButton slug={page.slug} />
              {embedded && <PreviewDraftButton slug={page.slug} path={page.path} />}
              {children}
            </>
          ),
        }}
      />
      {note && <Toast>{note}</Toast>}
    </div>
  )
}

function PageSwitcher({ current, onSwitch }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginRight: 12 }}>
      {Object.values(PAGES).map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={() => onSwitch(p.key)}
          style={{
            padding: '6px 12px', borderRadius: 8, cursor: 'pointer', font: `500 13px ${FONT}`,
            border: '1px solid ' + (current === p.key ? '#111' : '#ddd'),
            background: current === p.key ? '#111' : '#fff',
            color: current === p.key ? '#fff' : '#333',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

/* "Save draft" persists the current editor state privately (does NOT go live). */
function SaveDraftButton({ slug }) {
  const { appState } = usePuck()
  const [state, setState] = useState('idle') // idle | saving | saved | error
  const label = state === 'saving' ? 'Saving…' : state === 'saved' ? 'Draft saved ✓' : state === 'error' ? 'Save failed' : 'Save draft'
  return (
    <button
      type="button"
      onClick={async () => {
        setState('saving')
        try { await saveDraft(slug, appState.data); setState('saved'); setTimeout(() => setState('idle'), 2000) }
        catch { setState('error'); setTimeout(() => setState('idle'), 2500) }
      }}
      style={{ marginRight: 8, padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', font: `500 14px ${FONT}`, cursor: 'pointer' }}
    >
      {label}
    </button>
  )
}

/* "Preview draft" saves the working draft, then opens the real page in preview mode
   (?preview=1 + the studio ticket) so the client sees their edits live before publishing. */
function PreviewDraftButton({ slug, path }) {
  const { appState } = usePuck()
  const [busy, setBusy] = useState(false)
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        try { await saveDraft(slug, appState.data) } catch { /* preview still opens with last-saved draft */ }
        const ticket = getStudioTicket()
        window.open(`${path}?preview=1#ticket=${encodeURIComponent(ticket || '')}`, '_blank', 'noopener')
        setBusy(false)
      }}
      style={{ marginRight: 8, padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', font: `500 14px ${FONT}`, cursor: 'pointer' }}
    >
      {busy ? 'Opening…' : 'Preview draft'}
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
        <p style={{ margin: '0 0 20px', color: '#888', fontSize: 13 }}>Sign in to edit your storefront.</p>
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
