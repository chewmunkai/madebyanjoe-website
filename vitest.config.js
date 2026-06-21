import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Tests run through Vite, so JSX (react plugin) and `?raw` manifest imports work.
// `node` env — the compiler is tested as data, nothing is rendered.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,jsx}'],
  },
})
