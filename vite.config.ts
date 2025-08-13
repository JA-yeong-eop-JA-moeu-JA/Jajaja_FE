import fs from 'fs';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
const hasCert = fs.existsSync('./key.pem') && fs.existsSync('./cert.pem');

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr({ include: '**/*.svg?react' })],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: hasCert
    ? {
        https: {
          key: fs.readFileSync('./key.pem'),
          cert: fs.readFileSync('./cert.pem'),
        },
        host: true,
        port: 5173,
        // 프록시 설정 추가
        proxy: {
          '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            secure: false,
            ws: true,
          },
          '/oauth2': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            secure: false,
          },
        },
      }
    : {
        host: true,
        port: 5173,
        // 프록시 설정 추가
        proxy: {
          '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            secure: false,
            ws: true,
          },
          '/oauth2': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            secure: false,
          },
        },
      },
});
