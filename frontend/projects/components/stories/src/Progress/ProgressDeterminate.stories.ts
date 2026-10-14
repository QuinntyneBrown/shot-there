import type { StoryObj } from '@storybook/angular';

import type { ProgressComponent } from '@shot-there/components';

export const Determinate: StoryObj<ProgressComponent> = {
  render: () => ({
    template: `
      <div class="stack" style="max-width: 360px">
        <st-progress [value]="0" label="Uploading headshot.jpg" />
        <st-progress [value]="45" label="Uploading gallery-02.jpg" />
        <st-progress [value]="80" label="Uploading gallery-03.jpg" />
        <st-progress [value]="100" label="Uploading gallery-04.jpg" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A `value` from 0 to 100 fills the bar and sets `aria-valuenow`; values outside the range are clamped.',
      },
    },
  },
};
