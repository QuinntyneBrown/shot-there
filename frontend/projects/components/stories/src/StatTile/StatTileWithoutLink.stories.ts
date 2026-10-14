import type { StoryObj } from '@storybook/angular';

import type { StatTileComponent } from '@shot-there/components';

export const WithoutLink: StoryObj<StatTileComponent> = {
  render: () => ({
    template: `
      <ul st-stat-grid>
        <li st-stat-tile title="Guides" counts="3 published, 1 draft" [headingLevel]="3">
          <a st-button href="#/admin/guides/new"><st-icon name="plus" />New guide</a>
        </li>
      </ul>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'With `link` left `null` the title is a plain heading with no link.',
      },
    },
  },
};
