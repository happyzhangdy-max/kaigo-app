import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/kaigo-app/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: '介護福祉士 試験対策',
        short_name: '介護福祉士',
        description: '介護福祉士国家試験 学習アプリ — 中日双语',
        theme_color: '#a67c52',
        background_color: '#fdfaf6',
        display: 'standalone',
        lang: 'zh',
        scope: '.',
        start_url: '.',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
      },
    }),
  ],
});
