import type { StoryObj } from '@storybook/angular';

import type { SectionLinksComponent } from '@shot-there/components';

export const Admin: StoryObj<SectionLinksComponent> = {
  render: () => ({
    props: {
      items: [
        {
          label: 'Dashboard',
          meta: '2 items need re-verifying',
          link: '/admin',
          exact: true,
          attention: true,
        },
        { label: 'Studios', meta: '7 published, 2 draft', link: '/admin/studios' },
        { label: 'Spots', meta: '5 published, 1 draft', link: '/admin/spots' },
        { label: 'Guides', meta: '3 published, 1 draft', link: '/admin/guides' },
        { label: 'View site', meta: 'The public home page', link: '/', exact: true },
      ],
    },
    template: `
      <div style="max-width: 360px">
        <st-section-links navLabel="Administration" [items]="items" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The admin menu: `attention` draws Dashboard’s meta in the danger colour while anything needs re-verifying. Select a row to see it marked current.',
      },
    },
  },
};
