import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'game-lib',
    },
    rollupOptions: {
      output: {
        dir: 'dist',
      },
    },
  },
});