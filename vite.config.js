import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Single-page app. WebGL/scroll-heavy, so we keep three/drei in a vendor chunk.
// Base path: GitHub Pages project site builds under /madebyanjoe-website/, but a
// root deploy (e.g. the talos nginx behind anjoe.edgepoint.work) needs '/'. Set
// VITE_BASE=/ at build time for a root deploy. Dev keeps '/'.
export default defineConfig(({ command }) => ({
  base: process.env.VITE_BASE || (command === 'build' ? '/madebyanjoe-website/' : '/'),
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
