import type { StoryObj } from '@storybook/angular';

import type { InlineMessageComponent } from '@shot-there/components';

export const Help: StoryObj<InlineMessageComponent> = {
  render: () => ({
    template: `
      <div class="stack" style="max-width: 360px">
        <button type="button" aria-describedby="map-help">Preview on map</button>
        <p st-inline-message id="map-help">The preview moves as you type.</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Help text referenced by `aria-describedby` through the `id` the consumer gives it.',
      },
    },
  },
};
