import type { StoryObj } from '@storybook/angular';

import type { StatTileComponent } from '@shot-there/components';

export const Default: StoryObj<StatTileComponent> = {
  args: {
    title: 'Studios',
    counts: '7 published, 2 draft',
    link: '/admin/studios',
    headingLevel: 3,
  },
  argTypes: {
    headingLevel: { control: 'inline-radio', options: [2, 3, 4] },
  },
  render: (args) => ({
    props: args,
    template: `
      <ul st-stat-grid>
        <li st-stat-tile [title]="title" [counts]="counts" [link]="link" [headingLevel]="headingLevel">
          <a st-button variant="primary" href="#/admin/studios/new"><st-icon name="plus" />New studio</a>
        </li>
      </ul>
    `,
  }),
};
