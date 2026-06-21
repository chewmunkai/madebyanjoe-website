import { useState } from 'react'
import { Puck } from '@measured/puck'
import '@measured/puck/puck.css'
import { config } from './homepage.config.jsx'
import { loadHomepage, HOMEPAGE_KEY } from './homepage.js'

/* Visual homepage editor. Reorder/add/remove your real sections, edit the hero copy,
   then Publish → saves the layout and opens the live homepage in a new tab. DEMO:
   persistence is local (localStorage); a production version saves to the backend. */
export default function Studio() {
  const [data] = useState(loadHomepage)

  return (
    <div style={{ height: '100vh' }}>
      <Puck
        config={config}
        data={data}
        headerTitle="ANJOE — Edit homepage"
        onPublish={(d) => {
          localStorage.setItem(HOMEPAGE_KEY, JSON.stringify(d))
          window.open('/', '_blank')
        }}
      />
    </div>
  )
}
