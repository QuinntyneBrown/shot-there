import type { StoryObj } from '@storybook/angular';

import type { SiteHeaderComponent } from '@shot-there/components';

export const Default: StoryObj<SiteHeaderComponent> = {
  args: {
    brand: 'ShotThere',
    brandTag: 'Toronto',
    homeLink: '/',
    navLabel: 'Primary',
    links: [
      { label: 'Studios', link: '/studios' },
      { label: 'Spots', link: '/spots' },
      { label: 'Map', link: '/map' },
      { label: 'Compare', link: '/compare' },
      { label: 'Guides', link: '/guides' },
    ],
    menuExpanded: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <st-site-header
        [brand]="brand"
        [brandTag]="brandTag"
        [homeLink]="homeLink"
        [navLabel]="navLabel"
        [links]="links"
        [menuExpanded]="menuExpanded"
      />
    `,
  }),
};
