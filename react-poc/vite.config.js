import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite + React. Dev server on 5174 (the static site uses 3000).
export default defineConfig({
  plugins: [react()],
  // host:true binds to 0.0.0.0; allowedHosts:true lets tunnel domains through.
  server: { host: true, port: 4174, open: false, allowedHosts: true },
});
