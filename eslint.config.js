import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '.cache/**',
      'carousel_dump.js',
      'dist/**',
      'div5_dump.html',
      'legacy/**',
      'node_modules/**',
      'public/**',
      'playwright-report/**',
      'test-results/**'
    ]
  },
  js.configs.recommended,
  {
    files: [
      'src/**/*.js',
      'tests/**/*.js',
      'tests/**/*.mjs'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        gsap: 'readonly',
        toggleFaq: 'writable'
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': ['error', { varsIgnorePattern: '^toggleFaq$' }],
      'no-console': ['error', { allow: ['log', 'warn', 'error'] }]
    }
  },
  ...tseslint.configs.recommended,
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  {
    files: ['src/**/*.js', 'tests/**/*.js', 'tests/**/*.mjs'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': ['error', { varsIgnorePattern: '^toggleFaq$' }]
    }
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      ...reactHooks.configs.recommended.rules
    }
  },
  {
    files: [
      'eslint.config.js',
      'vite.config.ts',
      'vitest.config.js',
      'playwright.config.{js,ts}'
    ],
    languageOptions: {
      globals: globals.node
    }
  }
];
