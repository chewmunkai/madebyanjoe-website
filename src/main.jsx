import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'
import './styles/sections.css'

// No StrictMode: it double-mounts effects in dev, which fights the single
// WebGL canvas + GSAP ScrollTrigger lifecycle. Cleanups are handled per-effect.
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
