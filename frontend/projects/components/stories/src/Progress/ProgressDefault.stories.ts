import type { StoryObj } from '@storybook/angular';

import type { ProgressComponent } from '@shot-there/components';

export const Default: StoryObj<ProgressComponent> = {
  args: {
    value: 45,
    label: 'Uploading gallery-02.jpg',
    tone: 'neutral',
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    tone: { control: 'inline-radio', options: ['neutral', 'success', 'danger'] },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 360px">
        <st-progress [value]="value" [label]="label" [tone]="tone" />
      </div>
    `,
  }),
};
