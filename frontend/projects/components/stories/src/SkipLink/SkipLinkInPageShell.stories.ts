import type { StoryObj } from '@storybook/angular';

import type { SkipLinkComponent } from '@shot-there/components';

export const InPageShell: StoryObj<SkipLinkComponent> = {
  render: () => ({
    props: {
      links: [
        { label: 'Studios', link: '/studios' },
        { label: 'Spots', link: '/spots' },
        { label: 'Map', link: '/map' },
        { label: 'Compare', link: '/compare' },
        { label: 'Guides', link: '/guides' },
      ],
      crumbs: [{ label: 'Studios', link: '/studios' }, { label: 'The Junction Loft' }],
    },
    template: `
      <st-skip-link />
      <st-site-header brand="ShotThere" brandTag="Toronto" homeLink="/" navLabel="Primary" [links]="links" />
      <main id="main" tabindex="-1" class="container">
        <st-breadcrumb [items]="crumbs" />
        <h1>The Junction Loft</h1>
      </main>
    `,
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '260px' },
      description: {
        story:
          'Before the header, the skip link lets a keyboard user pass the wordmark and five header links: after it, the next Tab lands on the breadcrumb.',
      },
    },
  },
};
