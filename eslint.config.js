import neostandard from 'neostandard'

export default [
  ...neostandard({
    ts: true,
    ignores: ['dist/**', 'node_modules/**'],
    noJsx: true,
  }),
  {
    rules: {
      'object-curly-spacing': ['error', 'always'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      '@stylistic/type-annotation-spacing': ['error',],
      '@stylistic/arrow-spacing': ['error', { before: true, after: true }],
      '@stylistic/type-generic-spacing': ['error']
    },
  },
]
