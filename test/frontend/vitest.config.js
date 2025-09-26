import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.js',
        '**/*.config.ts',
        '**/main.jsx',
        '**/index.js'
      ]
    },
    server: {
      deps: {
        inline: ['@testing-library/jest-dom']
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../../frontend/src'),
      '@components': resolve(__dirname, '../../frontend/src/components'),
      '@pages': resolve(__dirname, '../../frontend/src/pages'),
      '@hooks': resolve(__dirname, '../../frontend/src/hooks'),
      '@contexts': resolve(__dirname, '../../frontend/src/contexts'),
      '@services': resolve(__dirname, '../../frontend/src/services'),
      '@utils': resolve(__dirname, '../../frontend/src/utils')
    }
  }
});