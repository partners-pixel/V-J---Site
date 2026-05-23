import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite + React. Dev server on 5174 (the static site uses 3000).
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, open: false },
});
