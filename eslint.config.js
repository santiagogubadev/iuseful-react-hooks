import neostandard from 'neostandard'
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
  ...neostandard({
    ts: true,
    ignores: ['dist/**', 'node_modules/**'],
    noJsx: true,
  }),
  configPrettier,
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      'object-curly-spacing': ['error', 'always'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      '@stylistic/type-annotation-spacing': ['error'],
      '@stylistic/arrow-spacing': ['error', { before: true, after: true }],
      '@stylistic/type-generic-spacing': ['error'],
      '@stylistic/max-len': [
        'error',
        {
          code: 100,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'prettier/prettier': [
        'error',
        {
          printWidth: 100,
          singleQuote: true,
          trailingComma: 'all',
          semi: false,
          arrowParens: 'always',
          bracketSpacing: true,
          endOfLine: 'auto',
        },
      ],
    },
  },
]
