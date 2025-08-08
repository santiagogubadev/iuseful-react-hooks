/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    restoreMocks: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
