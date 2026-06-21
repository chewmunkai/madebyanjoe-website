import { useState } from 'react'
import { uploadMedia } from '../lib/builderApi.js'

const FONT = 'Manrope, system-ui, sans-serif'

/* A Puck custom field that uploads an image/video to Medusa and stores its URL.
   Shows a preview, an upload/replace button, a paste-a-URL fallback, and a remove. */
function MediaField({ value, onChange }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function pick(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true); setErr('')
    try { onChange(await uploadMedia(file)) }
    catch (ex) { setErr(ex.message) }
    finally { setBusy(false); e.target.value = '' }
  }

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {value ? (
        <img src={value} alt="" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
      ) : null}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', font: `500 13px ${FONT}`, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1 }}>
          {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
          <input type="file" accept="image/*,video/*" onChange={pick} disabled={busy} style={{ display: 'none' }} />
        </label>
        {value ? (
          <button type="button" onClick={() => onChange('')} style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #eee', background: '#fff', font: `500 13px ${FONT}`, cursor: 'pointer', color: '#c0392b' }}>Remove</button>
        ) : null}
      </div>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste an image/video URL"
        style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: 7, border: '1px solid #e2e0db', font: `400 12px ${FONT}` }}
      />
      {err ? <div style={{ color: '#c0392b', fontSize: 12 }}>{err}</div> : null}
    </div>
  )
}

/* Helper to declare an image/upload field in a Puck component config. */
export function imageField(label) {
  return { type: 'custom', label, render: ({ value, onChange }) => <MediaField value={value} onChange={onChange} /> }
}
