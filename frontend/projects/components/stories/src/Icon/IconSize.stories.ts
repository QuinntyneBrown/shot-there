import type { StoryObj } from '@storybook/angular';

import type { IconComponent } from '@shot-there/components';

export const Size: StoryObj<IconComponent> = {
  render: () => ({
    template: `
      <div class="cluster">
        <st-icon name="map-pin" size="sm" />
        <st-icon name="map-pin" />
        <st-icon name="map-pin" size="lg" />
        <st-icon name="map-pin" size="xl" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '`sm`, `md` (default), `lg` and `xl` map to `--icon-size-*`.',
      },
    },
  },
};
