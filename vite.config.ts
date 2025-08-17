import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/presentation': path.resolve(__dirname, './src/presentation'),
      '@/domain': path.resolve(__dirname, './src/domain'),
      '@/infrastructure': path.resolve(__dirname, './src/infrastructure')
    }
  },
  server: {
    proxy: {
      '/auth': {
        target: 'http://192.168.1.30:8088',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'http://192.168.1.30:8088',
        changeOrigin: true,
        secure: false
      }
    }
  }
})