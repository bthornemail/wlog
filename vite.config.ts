import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        viewer: resolve(__dirname, 'viewer.html'),
        scene: resolve(__dirname, 'scene.html'),
        compose: resolve(__dirname, 'compose.html'),
        aztecSlideRule: resolve(__dirname, 'aztec-slide-rule.html'),
        quartetReconciliationDemo: resolve(__dirname, 'quartet-reconciliation-demo.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/ui/components')
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
