import type { StoryObj } from '@storybook/angular';

import type { InlineMessageComponent } from '@shot-there/components';

export const Default: StoryObj<InlineMessageComponent & { text: string }> = {
  args: {
    tone: 'help',
    text: 'Whole numbers from 1 to 5. The overall score is calculated by the server.',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['help', 'error'] },
  },
  render: (args) => ({
    props: args,
    template: `<p st-inline-message [tone]="tone">{{ text }}</p>`,
  }),
};
