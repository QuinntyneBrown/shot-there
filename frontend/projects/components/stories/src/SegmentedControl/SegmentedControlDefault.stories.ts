import type { StoryObj } from '@storybook/angular';

import type { SegmentedControlComponent } from '@shot-there/components';

export const Default: StoryObj<SegmentedControlComponent> = {
  args: {
    label: 'Show',
    options: [
      { value: 'both', label: 'Both' },
      { value: 'studios', label: 'Studios' },
      { value: 'spots', label: 'Spots' },
    ],
    value: 'both',
  },
  render: (args) => ({
    props: args,
    template: `<st-segmented [label]="label" [options]="options" [(value)]="value" />`,
  }),
};
