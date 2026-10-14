import type { StoryObj } from '@storybook/angular';

import type { SiteHeaderComponent } from '@shot-there/components';

export const Admin: StoryObj<SiteHeaderComponent> = {
  render: () => ({
    props: {
      links: [
        { label: 'Dashboard', link: '/admin', exact: true },
        { label: 'Studios', link: '/admin/studios' },
        { label: 'Spots', link: '/admin/spots' },
        { label: 'Guides', link: '/admin/guides' },
        { label: 'View site', link: '/', exact: true },
      ],
    },
    template: `
      <st-site-header
        brand="ShotThere"
        brandTag="Admin"
        homeLink="/admin"
        navLabel="Administration"
        [links]="links"
      >
        <button st-button slot="actions" variant="ghost" type="button">Sign out</button>
      </st-site-header>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The admin area: "Admin" tag, five links with Dashboard and View site `exact`, and Sign out projected into `slot="actions"`. Select a link to see it marked current.',
      },
    },
  },
};
