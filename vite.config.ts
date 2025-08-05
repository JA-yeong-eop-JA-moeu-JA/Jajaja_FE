import fs from 'fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// 인증서 유무 확인
const hasCert = fs.existsSync('./key.pem') && fs.existsSync('./cert.pem');

// https 설정 + proxy 설정 포함
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr({ include: '**/*.svg?react' })],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    ...(hasCert
      ? {
          https: {
            key: fs.readFileSync('./key.pem'),
            cert: fs.readFileSync('./cert.pem'),
          },
        }
      : {}),
    host: true,
    port: 5173,

    // ✅ 프록시 설정
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '', // 쿠키 도메인을 localhost로 재작성
      },
    },
  },
});
