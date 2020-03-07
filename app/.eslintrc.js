module.exports = {
  root: true,

  env: {
    node: true
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': [
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      { singleQuote: true }
    ]
  },

  parserOptions: {
    parser: '@typescript-eslint/parser'
  },

  extends: ['plugin:vue/essential', '@vue/prettier', '@vue/typescript']
};
