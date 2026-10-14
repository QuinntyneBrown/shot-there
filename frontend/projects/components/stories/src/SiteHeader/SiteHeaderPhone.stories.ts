import { signal } from '@angular/core';
import type { StoryObj } from '@storybook/angular';

import type { SiteHeaderComponent } from '@shot-there/components';

export const Phone: StoryObj<SiteHeaderComponent> = {
  render: () => {
    const open = signal(false);
    return {
      props: {
        open,
        links: [
          { label: 'Studios', link: '/studios' },
          { label: 'Spots', link: '/spots' },
          { label: 'Map', link: '/map' },
          { label: 'Compare', link: '/compare' },
          { label: 'Guides', link: '/guides' },
        ],
      },
      template: `
        <st-site-header
          brand="ShotThere"
          brandTag="Toronto"
          homeLink="/"
          navLabel="Primary"
          [links]="links"
          menuControls="site-menu"
          [menuExpanded]="open()"
          (menuToggled)="open.set(!open())"
        />
        <p class="container" role="status">Site menu {{ open() ? 'open' : 'closed' }}</p>
      `,
    };
  },
  globals: { viewport: { value: 'xs', isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          'Below 48rem the links fold behind Menu, which emits `menuToggled`; the application flips `menuExpanded` and opens its sheet.',
      },
    },
  },
};
