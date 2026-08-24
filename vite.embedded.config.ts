import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    cssCodeSplit: false,
    emptyOutDir: true,
    outDir: resolve(import.meta.dirname, 'salesforce/force-app/main/default/staticresources/ReadyCurrentEmbedded'),
    lib: {
      entry: resolve(import.meta.dirname, 'src/embedded.tsx'),
      name: 'ReadyCurrentEmbedded',
      formats: ['iife'],
      fileName: () => 'app.js'
    },
    rollupOptions: { output: { assetFileNames: 'app.css' } }
  }
});
