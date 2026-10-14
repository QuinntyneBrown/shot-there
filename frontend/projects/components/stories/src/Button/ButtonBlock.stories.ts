import type { StoryObj } from '@storybook/angular';

import type { ButtonComponent } from '@shot-there/components';

export const Block: StoryObj<ButtonComponent> = {
  render: () => ({
    template: `
      <div class="stack" style="max-width: 360px">
        <button st-button variant="primary" block type="submit">Sign in</button>
        <div class="cluster">
          <button st-button type="button">Clear all</button>
          <button st-button variant="primary" block type="submit">Show 7 studios</button>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: { story: '`block` fills the available inline space.' },
    },
  },
};
