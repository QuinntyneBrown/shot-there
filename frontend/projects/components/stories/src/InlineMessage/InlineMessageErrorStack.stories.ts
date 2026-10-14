import type { StoryObj } from '@storybook/angular';

import type { InlineMessageComponent } from '@shot-there/components';

export const ErrorStack: StoryObj<InlineMessageComponent> = {
  render: () => ({
    template: `
      <div class="stack" role="alert" style="max-width: 360px">
        <p st-inline-message tone="error">
          studio-floorplan.svg isn't a supported image. Use JPEG, PNG, WebP or AVIF.
        </p>
        <p st-inline-message tone="error">raw-export.tif is 25 MB. The limit is 20 MB.</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Several refused files: the errors stack in one wrapper that carries `role="alert"` once.',
      },
    },
  },
};
