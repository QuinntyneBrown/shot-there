import type { StoryObj } from '@storybook/angular';

import type { StatTileComponent } from '@shot-there/components';

export const ZeroCounts: StoryObj<StatTileComponent> = {
  render: () => ({
    template: `
      <ul st-stat-grid>
        <li st-stat-tile title="Spots" counts="0 published, 0 draft" link="/admin/spots" [headingLevel]="3">
          <a st-button href="#/admin/spots/new"><st-icon name="plus" />New spot</a>
        </li>
      </ul>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Zero counts are written "0" and the tile is unchanged; creating is always allowed.',
      },
    },
  },
};
