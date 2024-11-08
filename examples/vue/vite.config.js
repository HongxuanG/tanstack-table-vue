import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
     build: {
       lib: {
         entry: resolve(__dirname, 'src/index.ts'),
         name: 'VueTable',
         fileName: 'index'
       },
       rollupOptions: {
         external: ['vue'],
         output: {
           globals: {
             vue: 'Vue'
           }
         }
       }
     }
})
