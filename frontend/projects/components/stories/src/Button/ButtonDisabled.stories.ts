import type { StoryObj } from '@storybook/angular';

import type { ButtonComponent } from '@shot-there/components';

export const Disabled: StoryObj<ButtonComponent> = {
  render: () => ({
    template: `
      <div class="stack" style="max-width: 320px">
        <button st-button variant="ghost-danger" block type="button" softDisabled aria-describedby="delete-hint">
          Delete studio
        </button>
        <p id="delete-hint">Unpublish before deleting.</p>
        <button st-button block type="button" disabled>Publish</button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`softDisabled` keeps the button focusable so its explanation is reachable; native `disabled` removes it from the tab order.',
      },
    },
  },
};
