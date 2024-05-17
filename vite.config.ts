import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { quasar } from '@quasar/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  base: (process.env.MODE == 'gh-pages')
    ? '/client/'
    : '/',
  plugins: [
    vue(),
    vueJsx(),
    quasar(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'esnext'
  },
})
