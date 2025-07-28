import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr({ include: '**/*.svg?react' })],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://jajaja.kro.kr',
        changeOrigin: true,
        secure: false, // HTTPS 인증서가 self-signed인 경우 필요
      },
    },
  },
});
