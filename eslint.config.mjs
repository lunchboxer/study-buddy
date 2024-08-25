import js from '@eslint/js'
import eslintPluginPromise from 'eslint-plugin-promise'
import eslintPluginSecurity from 'eslint-plugin-security'
import eslintPluginSvelte from 'eslint-plugin-svelte'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import standardConfig from './eslint-standard.config.js'
import svelteConfig from './svelte.config.js'

export default [
  eslintPluginUnicorn.configs['flat/recommended'],
  ...eslintPluginSvelte.configs['flat/recommended'],
  eslintPluginSecurity.configs.recommended,
  eslintPluginPromise.configs['flat/recommended'],
  {
    files: ['**/*.js', '**/*.svelte'],
    languageOptions: {
      parserOptions: {
        svelteConfig,
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...standardConfig.rules,
      'security/detect-object-injection': 'off',
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
      'unicorn/template-indent': [
        'error',
        {
          indent: 2,
        },
      ],
    },
  },
]
