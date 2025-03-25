import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'esbuild',
  },
  optimizeDeps: {
    include: ['jwt-decode'], // 👈 Forzar que Vite lo optimice bien
  },
});
