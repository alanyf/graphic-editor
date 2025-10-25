const globals = require('globals');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');

module.exports = [
  {
    ignores: [
      'node_modules/**/*',
      'dist/**/*',
      '.vscode/**/*',
      'tsconfig.json',
    ],
  },
  // 普通JavaScript文件配置
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // TypeScript和JSX文件配置
  {
    files: ['**/*.{ts,tsx,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // 未使用变量检查
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      // React相关规则
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      // React Hooks规则
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // 其他常用规则
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
      'eqeqeq': ['error', 'always'],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      // TypeScript规则
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];