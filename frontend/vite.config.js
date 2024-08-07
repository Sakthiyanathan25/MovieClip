import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  plugins: [react(),envCompatible(),],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        // Add other entry points if necessary
      }
    }
  },
  // Configure other options as necessary
});