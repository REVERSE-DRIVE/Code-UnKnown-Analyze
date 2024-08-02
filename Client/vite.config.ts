import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/code_unknown/admin',
  server: {
    proxy: {
      '/code_unknown/api': {
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/code_unknown\/api/, ''),
        target: "http://localhost:3000"
      }
    }
  }
})
