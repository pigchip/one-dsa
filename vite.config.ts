import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base is '/one-dsa/' for production builds so the app can be served as a
// sub-path of aguzmancruz.com/one-dsa; dev server stays at '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/one-dsa/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
