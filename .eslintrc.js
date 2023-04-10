module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    // "eslint:recommended",
    'plugin:prettier/recommended',
    // "plugin:vue/vue3-essential",
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:nuxt/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    // "vue",
    '@typescript-eslint'
  ],
  ignorePatterns: ['src/static/**', '*.json', '*.md', 'src/assets/**'],
  rules: {
    'vue/html-self-closing': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 0,
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': ['error', { code: 140 }],
    'no-multi-spaces': 'error',
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed'],
    'no-trailing-spaces': ['error', { skipBlankLines: true }],
    'key-spacing': ['error', { afterColon: true }],
    'object-curly-spacing': ['error', 'always'],
    'comma-spacing': ['error', { before: false, after: true }],
    'prettier/prettier': [
      'error',
      {
        printWidth: 140,
        tabWidth: 2,
        useTabs: false,
        singleQuote: true,
        semi: false,
        trailingComma: 'none',
        arrowParens: 'avoid',
        jsxBracketSameLine: true
      }
    ]
  }
}
