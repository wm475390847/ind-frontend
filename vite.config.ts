import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import lessToJS from 'less-vars-to-js';
import fs from 'fs'
import path from 'path'

// 将 less 变量转为 JavaScript 对象
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './src/styles/variables.less'), 'utf8')
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    extensions: ['.js', '.ts', '.jsx', '.tsx']
  },

  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript，支持 less 内联 JS
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(__dirname, './src/styles/variables.less')}";`,
        modifyVars: themeVariables
      },
    }
  },

  server: {
    port: 5001,
    proxy: {
      '/ind': {
        target: 'http://124.223.115.179:6001/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ind/, '')
      },
    }
  }
})
