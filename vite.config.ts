import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Optional but useful for cleaner imports
    },
  },
  build: {
    outDir: 'dist', // default, but explicitly defined
    sourcemap: true, // optional, helps with debugging on Vercel
  },
});
