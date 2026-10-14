import type { StoryObj } from '@storybook/angular';

import type { ButtonComponent } from '@shot-there/components';

export const IconOnly: StoryObj<ButtonComponent> = {
  render: () => ({
    template: `
      <div class="cluster">
        <button st-button variant="ghost" iconOnly type="button" aria-label="Close">
          <st-icon name="close" />
        </button>
        <button st-button variant="ghost" size="sm" iconOnly type="button" aria-label="Close">
          <st-icon name="close" />
        </button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '`iconOnly` makes the button square. The consumer sets `aria-label` on the host.',
      },
    },
  },
};
