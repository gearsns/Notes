import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./ssl/localhost-key.pem'),
      cert: fs.readFileSync('./ssl/localhost.pem'),
    }
  },
  base: './',
  plugins: [vue(),
  VitePWA({
    registerType: "autoUpdate",
    manifest: {
      lang: 'ja',
      short_name: 'Notes',
      name: 'Notes',
      background_color: '#fff',
      theme_color: '#fff',
      display: 'standalone',
      id: 'index',
      start_url: 'index.html',
      orientation: 'portrait',
      icons: [
        {
          "src": "favicon.ico",
          "sizes": "48x48 32x32 128x128",
          "type": "image/x-icon"
        },
        {
          src: 'images/32.png',
          type: 'image/png',
          sizes: '32x32'
        },
        {
          src: 'images/48.png',
          type: 'image/png',
          sizes: '48x48'
        },
        {
          src: 'images/192.png',
          type: 'image/png',
          sizes: '192x192'
        },
        {
          src: 'images/512.png',
          type: 'image/png',
          sizes: '512x512'
        }
      ],
      screenshots: [
        {
          src: 'images/512.png',
          sizes: '512x512',
          form_factor: 'wide',
          label: 'With Software, you can select a part of your screen and take a screenshot in seconds.'
        },
        {
          src: 'images/512.png',
          sizes: '512x512',
          form_factor: 'narrow',
          label: 'With Software, you can select a part of your screen and take a screenshot in seconds.'
        }
      ]
    },
    workbox: {
      clientsClaim: true,
      skipWaiting: true,
      globPatterns: ['**/*.{js,css,html,woff,eot,ttf,svg,png}'],
      maximumFileSizeToCacheInBytes: 25097152,
      runtimeCaching: [
        {
          urlPattern: /assets\/.*/i,
          handler: 'CacheFirst'
        }
      ]
      , ignoreURLParametersMatching: [/.*/]
    },
    includeAssets: ['assets/*.ttf', 'assets/*.woff', 'assets/*.eot', 'assets/*.svg', 'images/*.png']
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/main.scss";`,
      },
    }
  }
})
