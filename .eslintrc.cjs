module.exports = {
  extends: [
    'standard',
    'plugin:unicorn/recommended',
    'plugin:svelte/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    es2017: true,
    browser: true,
    node: true,
  },
  ignorePatterns: ['**/dist', '*.html', '*.json'],
  plugins: ['security', 'svelte'],
  rules: {
    'unicorn/no-nested-ternary': 'off',
    'space-before-function-paren': 0,
    'comma-dangle': ['error', 'always-multiline'],
    // 'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 2, maxEOF: 1 }],
  },
}
