import { useState } from 'react'
import { Puck } from '@measured/puck'
import '@measured/puck/puck.css'
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

/* Visual page editor (Puck). Drag blocks from the left, edit their fields on the
   right, reorder on the canvas, then Publish → saves the layout to localStorage
   and opens the live preview. This is a DEMO: persistence is local-only; a real
   version would save the layout to the backend and render it as a store page. */
export default function Studio() {
  const [data] = useState(load)

  return (
    <div style={{ height: '100vh' }}>
      <Puck
        config={config}
        data={data}
        headerTitle="ANJOE Studio"
        onPublish={(d) => {
          localStorage.setItem(KEY, JSON.stringify(d))
          window.open('/studio/preview', '_blank')
        }}
      />
    </div>
  )
}
