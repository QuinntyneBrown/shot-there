import type { StoryObj } from '@storybook/angular';

import type { SiteHeaderComponent } from '@shot-there/components';

export const ExternalLink: StoryObj<SiteHeaderComponent> = {
  render: () => ({
    props: {
      links: [
        { label: 'Studios', link: '/studios' },
        { label: 'Spots', link: '/spots' },
        { label: 'YouTube', link: 'https://www.youtube.com/@shotthere', external: true },
      ],
    },
    template: `
      <st-site-header brand="ShotThere" brandTag="Toronto" homeLink="/" navLabel="Primary" [links]="links" />
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A `NavLink` with `external` opens a new tab with the arrow, and its name ends with the hidden "(opens in a new tab)".',
      },
    },
  },
};
