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
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'st', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: ['element', 'attribute'], prefix: 'st', style: 'kebab-case' },
      ],
    },
  },
  {
    files: ['projects/shot-there/src/**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
      '@angular-eslint/component-selector': ['error', { type: ['element', 'attribute'], prefix: 'app', style: 'kebab-case' }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@shot-there/components/*',
                '**/projects/components/**',
                '**/components/src/**',
                '**/dist/components/**',
              ],
              message: 'Import the library only from @shot-there/components (ICD-PKG-4).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['projects/shot-there/src/**/*.ts'],
    // TODO(re-platform): these still open CDK dialogs directly; move them to DialogService.
    ignores: [
      'projects/shot-there/src/app/core/shell/header.component.ts',
      'projects/shot-there/src/app/features/studios/studio-gallery/studio-gallery.component.ts',
      'projects/shot-there/src/app/features/studios/studio-list-page/studio-list-page.component.ts',
    ],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@angular/cdk/dialog',
              importNames: ['Dialog', 'DialogModule'],
              message:
                'Open dialogs, sheets and viewers through DialogService from @shot-there/components (ICD-OVL-2).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['projects/components/src/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@shot-there/api',
              message: 'The library never imports the API library (ICD-DEP-2).',
            },
            {
              name: '@angular/common/http',
              message: 'The library never makes HTTP calls (ICD-DEP-2).',
            },
            {
              name: '@angular/router',
              allowImportNames: ['RouterLink', 'RouterLinkActive'],
              message:
                'The library uses only RouterLink and RouterLinkActive from the router (ICD-DEP-1, ICD-API-11).',
            },
          ],
          patterns: [
            {
              group: ['@shot-there/api/*'],
              message: 'The library never imports the API library (ICD-DEP-2).',
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      'projects/shot-there/src/app/**/*.html',
      'projects/api/src/**/*.html',
      'projects/components/src/**/*.html',
    ],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/i18n': [
        'error',
        {
          checkId: false,
          checkText: true,
          ignoreAttributes: [
            'd',
            'rel',
            'referrerpolicy',
            'loading',
            'inputmode',
            'form',
            'sizes',
            'allow',
            'scope',
            'ariaCurrentWhenActive',
            'variant',
            'aria-controls',
            'aria-current',
            'aria-describedby',
            'aria-haspopup',
            'aria-labelledby',
            'aria-live',
            'aria-modal',
          ],
        },
      ],
    },
  },
);
