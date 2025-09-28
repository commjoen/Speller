import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import nPlugin from 'eslint-plugin-n';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        Event: 'readonly',
        Response: 'readonly',
        
        // Service Worker globals
        self: 'readonly',
        caches: 'readonly',
        
        // Node globals
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        
        // Jest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        
        // Project globals
        SpellerGame: 'readonly',
        PWAManager: 'readonly'
      }
    },
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      n: nPlugin
    },
    rules: {
      // Allow console statements for debugging
      'no-console': 'warn',
      
      // Allow unused vars that start with underscore
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      
      // Focus on more important issues
      'no-undef': 'error',
      'no-redeclare': 'error',
      
      // Import rules
      'import/no-unresolved': 'off', // We're not using modules in this project
      'import/named': 'off',
      'import/default': 'off',
      'import/namespace': 'off',
      
      // Promise rules
      'promise/always-return': 'warn',
      'promise/catch-or-return': 'warn',
      'promise/param-names': 'warn',
      'promise/no-return-wrap': 'warn',
      
      // Node rules
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      
      // Style rules - relaxed to maintain existing code
      'space-before-function-paren': 'off',
      'comma-dangle': 'off',
      'semi': 'off',
      'indent': 'off',
      'quotes': 'off',
      'no-trailing-spaces': 'off',
      'no-multiple-empty-lines': 'off',
      'eol-last': 'off'
    }
  },
  {
    ignores: [
      'node_modules/',
      'coverage/',
      'dist/',
      '*.min.js'
    ]
  }
];