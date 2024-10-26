import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from 'vite-plugin-glsl'
import autoImport from 'unplugin-auto-import/vite'
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import Markdown from 'vite-plugin-md'

export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/], // <--
    }),
    Markdown(),
    glsl(),
    autoImport({
      imports: ['vue', 'vue-router'],
      dts: './src/auto-imports.d.ts',
    })
  ],
  server: {
    port: 8080,

  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    },
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  }
})
