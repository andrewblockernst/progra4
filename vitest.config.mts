import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'


export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'cobertura'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        '.next/',
        'src/app/globals.css',
        'src/app/layout.tsx',
        'src/app/page.tsx',
        './src/test/setup.ts',
        'src/test/utils/',
        'src/test/mocks/',
      ],
      include: [
        'src/**/*.{ts,tsx}',
        '!src/test/**',
      ],
      thresholds: {
        global: {
          branches: 75,
          functions: 80,
          lines: 80,
          statements: 80
        },
        './src/components/': {
          branches: 70,
          functions: 75,
          lines: 75,
          statements: 75
        },
        './src/lib/': {
          branches: 80,
          functions: 85,
          lines: 85,
          statements: 85
        },
        './src/app/api/': {
          branches: 70,
          functions: 75,
          lines: 75,
          statements: 75
        }
      },
      all: true,
      skipFull: false,
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'src/**/__tests__/**/*.{ts,tsx}'
    ],
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'coverage',
      '**/*.config.*',
      '**/*.d.ts'
    ],
    reporters: ['verbose', 'html'],
    outputFile: {
      html: './coverage/html/index.html'
    },
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    isolate: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})