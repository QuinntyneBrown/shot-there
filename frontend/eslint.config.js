// @ts-check
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    ignores: ['dist/', '.angular/', 'node_modules/', 'test-results/', 'playwright-report/'],
  },
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'st', style: 'camelCase' }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'st', style: 'kebab-case' }],
    },
  },
  {
    files: ['src/app/**/*.html', 'libs/**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/i18n': ['error', { checkId: false, checkText: true, ignoreAttributes: ['d', 'rel', 'aria-haspopup', 'ariaCurrentWhenActive'] }],
    },
  },
);
