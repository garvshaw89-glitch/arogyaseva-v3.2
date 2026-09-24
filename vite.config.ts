import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  appType: 'spa',
  server: {
    port: 3004,
    host: '0.0.0.0',
    strictPort: true,
    cors: true
  },
  preview: {
    port: 3004,
    host: '0.0.0.0',
    strictPort: true,
    cors: true
  }
});

