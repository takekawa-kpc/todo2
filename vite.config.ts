import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages (https://<user>.github.io/todo2/) 向けに base を /todo2/ に設定する
export default defineConfig({
  base: '/todo2/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
  },
})
