import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'
import './styles/sections.css'
import './styles/pages.css'
import './styles/glass.css'

// No StrictMode: it double-mounts effects in dev, which fights the single
// WebGL canvas + GSAP ScrollTrigger lifecycle. Cleanups are handled per-effect.
// Router base matches Vite's base (e.g. /madebyanjoe-website on GitHub Pages,
// '' in dev) so client routes resolve under the project subpath.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>
)
