import { Link } from 'react-router-dom'
import { Render } from '@measured/puck'
import { config, defaultData } from './config.jsx'

const KEY = 'anjoe-studio'

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    return saved && saved.content ? saved : defaultData
  } catch {
    return defaultData
  }
}

/* The published page — renders whatever was composed in the editor. This is what
   a real store page built in the studio would look like. */
export default function StudioPreview() {
  const data = load()
  return (
    <div>
      <Link
        to="/studio"
        style={{ position: 'fixed', top: 14, left: 14, zIndex: 1000, background: '#16150F', color: '#F4EFE9', padding: '9px 18px', borderRadius: 100, textDecoration: 'none', fontSize: 13, fontFamily: 'Manrope, sans-serif' }}
      >
        ← Back to editor
      </Link>
      <Render config={config} data={data} />
    </div>
  )
}
