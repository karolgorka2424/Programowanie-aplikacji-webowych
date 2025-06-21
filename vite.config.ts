import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()  // Dodaj plugin Tailwind v4
  ],
  server: {
    port: 5173,
    open: true
  }
})