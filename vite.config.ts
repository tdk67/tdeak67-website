import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/chat': {
        target: 'http://127.0.0.1:8020',
        rewrite: (path) => path.replace(/^\/api\/chat/, '/v1/chat'),
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-markdown') || id.includes('remark-gfm')) {
              return 'markdown';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});