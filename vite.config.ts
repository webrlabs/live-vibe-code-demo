import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api/osti': { target: 'https://www.osti.gov', changeOrigin: true, rewrite: path => { const q = new URL(path, 'http://localhost').searchParams.get('q') || ''; return `/api/v1/records?rows=40&search=${encodeURIComponent(q)}` } } } },
})
