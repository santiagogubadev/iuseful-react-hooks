/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      enabled: true,
      include: ['src/**/*.{js,ts,jsx,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/utils/types/**', 'src/__tests__/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
