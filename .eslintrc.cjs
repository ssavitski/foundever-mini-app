module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
  ],
  globals: {
    NodeJS: true,
  },
  parserOptions: {
    ecmaversion: 12,
    sourcetype: 'module',
    parser: '@typescript-eslint/parser',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
    'unused-imports',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/object-curly-spacing': [2, 'always'],
    // 'vue/html-closing-bracket-spacing': [2, {
    //   'selfclosingtag': 'always',
    // }],
    semi: [2, 'always'],
    'no-unused-vars': 'off',
    'no-empty-pattern': 'off',
  },
};
