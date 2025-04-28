import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces (fixes WSL issues)
    port: 5173,
    strictPort: true, // Fail if port 5173 is already in use
    hmr: false, // Disable HMR to avoid WebSocket issues in WSL
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Correctly resolve the 'src' directory
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});