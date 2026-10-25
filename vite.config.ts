import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Using process.cwd() is standard, casting to any to avoid potential TS type issues in some environments.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Debugging: Check if keys are loaded
  const apiKey = env.API_KEY || env.GEMINI_API_KEY;
  
  if (apiKey) {
    console.log(`\x1b[32m[Build] Success: API Key found (starts with ${apiKey.substring(0,4)}...)\x1b[0m`);
  } else {
    console.warn(`\x1b[33m[Build] Warning: No API_KEY or GEMINI_API_KEY found in environment variables or .env file.\x1b[0m`);
    console.warn(`\x1b[33m[Build] The app will be built without an API key and chat features will be disabled.\x1b[0m`);
  }

  return {
    plugins: [react()],
    // Removed alias configuration to force strict relative path usage
    // Define global constants replacing them during the build.
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey || '')
    },
    build: {
      chunkSizeWarningLimit: 1600, 
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@google/genai')) {
                return 'genai';
              }
              if (id.includes('react-markdown') || id.includes('remark-gfm')) {
                return 'markdown';
              }
              return 'vendor';
            }
          },
        },
      },
    },
  };
});
