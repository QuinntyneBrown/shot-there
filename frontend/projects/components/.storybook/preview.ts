import '@angular/localize/init';
import { provideRouter, withHashLocation } from '@angular/router';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import { applicationConfig, type Preview } from '@storybook/angular';

import docJson from '../documentation.json';

// Inputs, outputs and JSDoc for the autodocs ArgTypes tables come from
// compodoc (`compodoc: true` on the angular.json storybook targets).
setCompodocJson(docJson);

/**
 * Every story renders with the same global stylesheet as the app
 * (`styles/shot-there.css`, via `angular.json` → `styles`). A router is
 * provided because the header, footer, breadcrumb and links render
 * `routerLink`s; hash location plus a catch-all route keep those clicks inside
 * the preview iframe instead of rewriting `iframe.html`.
 */
const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideRouter([{ path: '**', children: [] }], withHashLocation())],
    }),
    // The Theme toolbar sets data-theme on the preview root, as the app does.
    (story, context) => {
      const theme = context.globals['theme'] as string;
      if (theme === 'system') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
      return story();
    },
  ],
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  parameters: {
    layout: 'padded',
    backgrounds: {
      options: {
        canvas: { name: 'Canvas (--color-bg-canvas)', value: 'var(--color-bg-canvas)' },
        sunken: {
          name: 'Sunken (--color-bg-surface-sunken)',
          value: 'var(--color-bg-surface-sunken)',
        },
        subtle: { name: 'Subtle (--color-bg-subtle)', value: 'var(--color-bg-subtle)' },
      },
    },
    viewport: {
      // The L2 viewport classes (tokens.css → --layout-breakpoint-*).
      options: {
        xs: {
          name: 'XS phone (360×740)',
          styles: { width: '360px', height: '740px' },
          type: 'mobile',
        },
        md: {
          name: 'MD tablet (768×1024)',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        lg: {
          name: 'LG laptop (992×800)',
          styles: { width: '992px', height: '800px' },
          type: 'desktop',
        },
        xl: {
          name: 'XL desktop (1440×900)',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop',
        },
      },
    },
    controls: {
      expanded: true,
      matchers: { color: /(background|color)$/i },
    },
    a11y: {
      // WCAG 2.2 AA: fail the a11y panel loudly.
      test: 'error',
    },
    docs: {
      toc: { headingSelector: 'h2, h3' },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Concepts',
          [
            'Introduction',
            'Developer',
            ['Quick Start', 'Styling Components', 'Accessibility', 'Writing Stories'],
          ],
          'Theme',
          ['Colors', 'Typography', 'Spacing', 'Border Radii', 'Shadows', 'Motion', 'Layout'],
          'Components',
        ],
      },
    },
  },
};

export default preview;
