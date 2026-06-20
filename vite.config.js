import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    open: false,
    allowedHosts: true,
    // Forward backend API calls to the Express server (npm run dev) so the
    // admin panel, blog API, content API, etc. work from the Vite dev port.
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
      '/checklist-files': 'http://localhost:3000',
    },
  },
  preview: {
    host: true,
    port: 4174,
  },
});
