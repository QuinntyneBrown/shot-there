import type { StoryObj } from '@storybook/angular';

import type { ButtonComponent } from '@shot-there/components';

export const AsLink: StoryObj<ButtonComponent> = {
  render: () => ({
    template: `<a st-button variant="primary" href="#/studios">Browse studios</a>`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Put `st-button` on an `<a>` when the action navigates, so it stays a real link.',
      },
    },
  },
};
