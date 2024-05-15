import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'HistoryLib',
    },
    rollupOptions: {
      // Cấu hình đầu ra cho thư viện của bạn ở đây
      output: {
        dir: 'dist',
        format: 'umd', // hoặc 'es', 'cjs', 'iife'
      },
    },
  },
});