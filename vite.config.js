import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Single-page app. WebGL/scroll-heavy, so we keep three/drei in a vendor chunk.
// Deployed to a GitHub Pages project site → built under /madebyanjoe-website/.
// Dev keeps base '/' so the local server + preview tooling work normally.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/madebyanjoe-website/' : '/',
  plugins: [react()],
  server: { port: 5173, strictPort: true, host: true },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          motion: ['gsap', 'lenis'],
        },
      },
    },
  },
}))
