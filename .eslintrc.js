module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Allow console statements for debugging
    'no-console': 'warn',
    // Allow unused vars that start with underscore
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    // Relax formatting rules that prettier handles or that would break existing code
    'space-before-function-paren': 'off',
    'comma-dangle': 'off',
    'semi': 'off',
    'indent': 'off',
    'quotes': 'off',
    'no-trailing-spaces': 'off',
    'no-multiple-empty-lines': 'off',
    'eol-last': 'off',
    // Focus on more important issues
    'no-undef': 'error',
    'no-unused-vars': 'warn',
    'no-redeclare': 'error'
  },
  globals: {
    // Define global variables used in the project
    'SpellerGame': 'readonly',
    'PWAManager': 'readonly'
  },
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'dist/',
    '*.min.js'
  ]
}