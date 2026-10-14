import type { StoryObj } from '@storybook/angular';

import type { SectionLinksComponent } from '@shot-there/components';

export const Default: StoryObj<SectionLinksComponent> = {
  args: {
    navLabel: 'Primary',
    items: [
      { label: 'Studios', meta: '7 rental studios, measured the same way', link: '/studios' },
      { label: 'Spots', meta: '5 outdoor locations with permit notes', link: '/spots' },
      { label: 'Map', meta: 'Every studio and spot on one map', link: '/map' },
      { label: 'Compare', meta: 'Up to 4 studios side by side', link: '/compare' },
      { label: 'Guides', meta: 'Short lists, like the best studios under $120', link: '/guides' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 360px">
        <st-section-links [navLabel]="navLabel" [items]="items" />
      </div>
    `,
  }),
};
