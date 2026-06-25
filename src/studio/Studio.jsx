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
              <AutoSelectSingleBlock />
              <CanvasRevealStyle />
              <SyncCanvasScroll />
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

/* Single-block pages (everything except the multi-section homepage) render as one
   full-page block. Puck only shows a component's fields once it's SELECTED — but a
   full-page block has no obvious "click me" affordance, so the page looked
   un-editable. Auto-select the sole block on mount so its fields appear immediately,
   matching how the homepage's sections feel. (Multi-block pages are left alone.) */
function AutoSelectSingleBlock() {
  const puck = usePuck()
  const content = puck?.appState?.data?.content || []
  const id = content.length === 1 ? content[0]?.props?.id : undefined
  useEffect(() => {
    if (!id) return
    let done = false, tries = 0
    const select = () => {
      if (done) return
      // Authoritative selector for this block (correct index+zone) once its zone
      // has registered; retry while Puck mounts. Falls back to a plain index.
      const sel = puck.getSelectorForId ? puck.getSelectorForId(id) : { index: 0 }
      if (sel) { puck.dispatch({ type: 'setUi', ui: { itemSelector: sel } }); done = true }
      else if (tries++ < 15) setTimeout(select, 120)
    }
    const t = setTimeout(select, 60)
    return () => { done = true; clearTimeout(t) }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

/* The canvas renders each page directly, WITHOUT the storefront's scroll-reveal observer
   (that lives in App, outside the Puck iframe). So `.reveal` elements — most of every page
   below the hero — keep their initial opacity:0 and the canvas looks blank/grey while
   editing. Force them visible inside the editor only (mirrors the prefers-reduced-motion
   rule in global.css); the published page is untouched. Re-injects after Puck rebuilds the
   canvas iframe on a page switch. */
function CanvasRevealStyle() {
  useEffect(() => {
    let stopped = false
    const STYLE_ID = '__studio_reveal_visible'
    const inject = () => {
      if (stopped) return
      const f = document.querySelector('iframe#preview-frame')
      const doc = f && f.contentDocument
      if (doc && doc.head && !doc.getElementById(STYLE_ID)) {
        const s = doc.createElement('style')
        s.id = STYLE_ID
        s.textContent = '.reveal{opacity:1 !important;transform:none !important;}'
        doc.head.appendChild(s)
      }
    }
    inject()
    const iv = setInterval(inject, 700)
    return () => { stopped = true; clearInterval(iv) }
  }, [])
  return null
}

/* These pages render the WHOLE page as one tall block, but the field panel lists every
   section's fields in one long column. Editing a field far down the page (a timeline
   milestone, a value card) updates the canvas correctly — but that section is off-screen
   below the tall hero, so it LOOKS like nothing changed. When a field is focused, scroll
   the canvas to the element holding that field's text and flash it, so the live edit is
   always in view. Pure editor sugar — never affects the published page. */
function SyncCanvasScroll() {
  useEffect(() => {
    const frameDoc = () => {
      const f = document.querySelector('iframe#preview-frame') || document.querySelector('iframe')
      try { return f && f.contentDocument } catch { return null }
    }
    // Tightest element in the canvas whose text contains the field value.
    const locate = (doc, value) => {
      const needle = (value || '').trim()
      if (needle.length < 6) return null // skip short/ambiguous fields (already-visible hero bits)
      let best = null
      const walk = (node) => {
        for (const el of node.children) {
          if ((el.textContent || '').includes(needle)) { best = el; walk(el) }
        }
      }
      walk(doc.body)
      return best
    }
    let hl = null
    const clearHl = () => { if (hl) { hl.style.outline = ''; hl.style.outlineOffset = ''; hl.style.transition = ''; hl = null } }
    const onFocus = (e) => {
      const t = e.target
      if (!(t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement)) return
      const doc = frameDoc()
      if (!doc) return
      const el = locate(doc, t.value)
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      clearHl()
      hl = el
      el.style.transition = 'outline-color .5s ease'
      el.style.outline = '2px solid rgba(189,120,140,.95)'
      el.style.outlineOffset = '4px'
      const target = el
      setTimeout(() => { if (hl === target) target.style.outlineColor = 'transparent' }, 1000)
    }
    document.addEventListener('focusin', onFocus)
    return () => { document.removeEventListener('focusin', onFocus); clearHl() }
  }, [])
  return null
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
