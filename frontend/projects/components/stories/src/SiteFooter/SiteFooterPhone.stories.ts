import type { StoryObj } from '@storybook/angular';

import type { SiteFooterComponent } from '@shot-there/components';

export const Phone: StoryObj<SiteFooterComponent> = {
  render: () => ({
    props: {
      links: [
        { label: 'Studios', link: '/studios' },
        { label: 'Spots', link: '/spots' },
        { label: 'Guides', link: '/guides' },
        { label: 'Editorial policy', link: '/editorial-policy' },
        { label: 'YouTube channel', link: 'https://www.youtube.com/@shotthere', external: true },
      ],
    },
    template: `
      <st-site-footer
        brand="ShotThere"
        tagline="Toronto photo studios and outdoor spots, reviewed first-hand. Nothing is listed unless it has been shot there."
        navLabel="Footer"
        [links]="links"
        copy="© 2026 ShotThere · No paid placement: order comes only from the sort you choose."
      />
    `,
  }),
  globals: { viewport: { value: 'xs', isRotated: false } },
  parameters: {
    docs: {
      description: {
        story: 'On a phone the brand, links and copy line wrap onto their own rows.',
      },
    },
  },
};
