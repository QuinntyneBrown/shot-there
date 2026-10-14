import type { StoryObj } from '@storybook/angular';

import type { SiteFooterComponent } from '@shot-there/components';

export const Default: StoryObj<SiteFooterComponent> = {
  args: {
    brand: 'ShotThere',
    tagline:
      'Toronto photo studios and outdoor spots, reviewed first-hand. Nothing is listed unless it has been shot there.',
    navLabel: 'Footer',
    links: [
      { label: 'Studios', link: '/studios' },
      { label: 'Spots', link: '/spots' },
      { label: 'Guides', link: '/guides' },
      { label: 'Editorial policy', link: '/editorial-policy' },
      { label: 'YouTube channel', link: 'https://www.youtube.com/@shotthere', external: true },
    ],
    copy: '© 2026 ShotThere · No paid placement: order comes only from the sort you choose.',
  },
  render: (args) => ({
    props: args,
    template: `
      <st-site-footer
        [brand]="brand"
        [tagline]="tagline"
        [navLabel]="navLabel"
        [links]="links"
        [copy]="copy"
      />
    `,
  }),
};
