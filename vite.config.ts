import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/MSGRAPHTESTDEEPAN/', // Use the repository name here
  build: {
    outDir: 'dist', // Ensure this matches your `gh-pages` deploy directory
    emptyOutDir: true, // Clears the output directory before building
  },
});