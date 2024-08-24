import eslintPluginSvelte from 'eslint-plugin-svelte'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import eslintPluginSecurity from 'eslint-plugin-security'
import globals from 'globals'
import js from '@eslint/js'
import standardConfig from './eslint-standard.config.js'

export default [
  eslintPluginUnicorn.configs['flat/recommended'],
  ...eslintPluginSvelte.configs['flat/recommended'],
  eslintPluginSecurity.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    // doesn't include import plugin
    ...standardConfig,
    rules: {
      ...js.configs.recommended.rules,
      'security/detect-object-injection': 'off',
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
]
