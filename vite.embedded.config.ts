import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const frameHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ReadyCurrent</title>
    <link rel="stylesheet" href="./app.css" />
  </head>
  <body>
    <div id="readycurrent-embedded-root"></div>
    <script src="./app.js"></script>
  </body>
</html>
`;

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  plugins: [
    react(),
    {
      name: 'readycurrent-frame-html',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'index.html', source: frameHtml });
      }
    }
  ],
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
