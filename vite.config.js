import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        blog: resolve(__dirname, 'blog.html'),
        boxOfficeJasai: resolve(__dirname, 'box-office-jasai.html'),
        contact: resolve(__dirname, 'contact.html'),
        elite: resolve(__dirname, 'elite.html'),
        forBrokers: resolve(__dirname, 'for-brokers.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        puneCamp: resolve(__dirname, 'pune-camp.html')
      }
    }
  }
})
