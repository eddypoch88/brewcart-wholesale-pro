import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        workbox: {
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          navigateFallbackDenylist: [/^\/api/],
        },
        manifest: {
          name: 'ORB Commerce',
          short_name: 'ORB',
          description: 'Commerce Management Platform',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          orientation: 'portrait',
          icons: [
            {
              src: '/pwa-icon-192.svg',
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: '/pwa-icon-512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ]
        },
        devOptions: {
          enabled: false
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
