import type { StoryObj } from '@storybook/angular';

import type { SiteFooterComponent } from '@shot-there/components';

export const Minimal: StoryObj<SiteFooterComponent> = {
  render: () => ({
    props: {
      links: [
        { label: 'Editorial policy', link: '/editorial-policy' },
        { label: 'YouTube channel', link: 'https://www.youtube.com/@shotthere', external: true },
      ],
    },
    template: `<st-site-footer brand="ShotThere" navLabel="Footer" [links]="links" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Without `tagline` and `copy` the footer renders only the brand and its links.',
      },
    },
  },
};
