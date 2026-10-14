import type { StoryObj } from '@storybook/angular';

import type { ButtonComponent } from '@shot-there/components';

export const Size: StoryObj<ButtonComponent> = {
  render: () => ({
    template: `
      <div class="cluster">
        <button st-button size="sm" type="button">Remove</button>
        <button st-button type="button">Apply filters</button>
        <button st-button size="lg" variant="primary" type="button">Sign in</button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '`sm` is 36px, `md` (default) 44px and `lg` 52px — `--control-height-*`.',
      },
    },
  },
};
