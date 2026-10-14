import type { StoryObj } from '@storybook/angular';

import type { ButtonComponent } from '@shot-there/components';

export const Variant: StoryObj<ButtonComponent> = {
  render: () => ({
    template: `
      <div class="cluster">
        <button st-button variant="primary" type="button">Save changes</button>
        <button st-button type="button">Apply filters</button>
        <button st-button variant="ghost" type="button">Cancel</button>
        <button st-button variant="link" type="button">Clear all</button>
        <button st-button variant="danger" type="button">Delete studio</button>
        <button st-button variant="ghost-danger" type="button">Remove photo</button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`primary` is the one solid action on a screen; `secondary` is the default. `danger` and `ghost-danger` are for destructive actions only.',
      },
    },
  },
};
