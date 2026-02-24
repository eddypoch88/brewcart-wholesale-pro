import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Custom plugin: stamps a build timestamp into sw.js so every deploy
// gets a unique cache name — old caches are automatically purged.
function injectSwVersion(): Plugin {
  return {
    name: 'inject-sw-version',
    closeBundle() {
      const swPath = path.resolve(__dirname, 'dist', 'sw.js');
      if (fs.existsSync(swPath)) {
        const timestamp = Date.now().toString();
        const content = fs.readFileSync(swPath, 'utf-8');
        fs.writeFileSync(swPath, content.replace('__CACHE_VERSION__', timestamp), 'utf-8');
        console.log(`[sw-version] Cache version stamped: brewcart-${timestamp}`);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), injectSwVersion()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
