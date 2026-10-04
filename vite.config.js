import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  server: {
    host: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        privacy: resolve(import.meta.dirname, 'privacy-policy.html'),
        terms: resolve(import.meta.dirname, 'terms.html'),
        cookies: resolve(import.meta.dirname, 'cookies.html'),
        refund: resolve(import.meta.dirname, 'refund-policy.html'),
        framnova: resolve(import.meta.dirname, 'framnova-preview.html'),
        projects: resolve(import.meta.dirname, 'projects.html'),
        fermliving: resolve(import.meta.dirname, 'fermliving-preview.html'),
        raycast: resolve(import.meta.dirname, 'raycast-preview.html')
      }
    }
  }
});
