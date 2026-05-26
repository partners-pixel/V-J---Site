import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite + React. Dev server on 5174 (the static site uses 3000).
export default defineConfig({
  plugins: [react()],
  // host:true binds to 0.0.0.0; allowedHosts:true lets tunnel domains through.
  // /api is proxied to the existing Express mail backend (server.js on :3000).
  server: {
    host: true, port: 4174, open: false, allowedHosts: true,
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep the bundled legacy markup and vendor libs in their own chunks.
          if (id.includes('/src/legacy/') || id.includes('/src/data/auto')) return 'legacy';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
