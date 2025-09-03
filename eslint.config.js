import antfu from '@antfu/eslint-config';

export default antfu({
  type: 'app',
  typescript: true,
  formatters: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: 'single',
  },
  ignores: ['**/migrations/*'],
}, {
  rules: {
    'no-console': ['warn'],
    'perfectionist/sort-imports': ['error', {
      tsconfigRootDir: '.',
    }],
    'unicorn/filename-case': ['error', {
      case: 'kebabCase',
      ignore: ['README.md', 'CLAUDE.md'],
    }],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
  },
});
