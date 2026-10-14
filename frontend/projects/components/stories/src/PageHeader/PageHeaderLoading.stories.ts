import type { StoryObj } from '@storybook/angular';

import type { PageHeaderComponent } from '@shot-there/components';

export const Loading: StoryObj<PageHeaderComponent> = {
  render: () => ({
    template: `<st-page-header title="Loading studio" loading />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`loading` shows a skeleton in the `h1`; the title stays as visually hidden text, so the heading is named "Loading studio".',
      },
    },
  },
};
