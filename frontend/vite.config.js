import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on mode
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = mode === 'production';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Only use proxy in development mode
    server: !isProd
      ? {
          proxy: {
            '/api': {
              target: 'http://localhost:5000', // Use local backend in development
              changeOrigin: true,
            },
          },
        }
      : {},
    // No need to redefine import.meta.env variables - Vite handles them automatically
    build: {
      outDir: 'dist',
      sourcemap: !isProd,
    },
  };
});
