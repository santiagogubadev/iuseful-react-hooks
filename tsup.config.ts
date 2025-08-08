import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/hooks/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  outDir: 'dist',
  target: 'es2019',
  clean: true,
  splitting: false,
  outExtension: ({ format }) => {
    return {
      js: format === 'esm' ? '.mjs' : '.cjs'
    }
  },
})
