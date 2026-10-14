import type { StoryObj } from '@storybook/angular';

import type { ResultCountComponent } from '@shot-there/components';

export const SortSuffix: StoryObj<ResultCountComponent> = {
  render: () => ({
    template: `<st-result-count text="5 studios" srSuffix=", sorted by all-in cost" />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`srSuffix` is visually hidden: a screen reader hears "5 studios, sorted by all-in cost".',
      },
    },
  },
};
