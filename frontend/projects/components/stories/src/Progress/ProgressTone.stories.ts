import type { StoryObj } from '@storybook/angular';

import type { ProgressComponent } from '@shot-there/components';

export const Tone: StoryObj<ProgressComponent> = {
  render: () => ({
    template: `
      <div class="stack" style="max-width: 360px">
        <st-progress [value]="100" label="Uploaded gallery-04.jpg" tone="success" />
        <st-progress [value]="100" label="Failed gallery-06.jpg" tone="danger" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`success` and `danger` recolour the fill; the outcome itself must still be said in words beside the bar.',
      },
    },
  },
};
