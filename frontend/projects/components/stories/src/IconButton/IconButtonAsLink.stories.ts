import type { StoryObj } from '@storybook/angular';

import type { IconButtonComponent } from '@shot-there/components';

export const AsLink: StoryObj<IconButtonComponent> = {
  render: () => ({
    template: `<a st-icon-button icon="home" label="Home" href="#/" aria-current="page"></a>`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'On an `<a>` it stays a real link; `aria-current="page"` marks it current in accent ink.',
      },
    },
  },
};
