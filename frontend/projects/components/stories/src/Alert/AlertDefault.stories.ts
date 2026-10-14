import type { StoryObj } from '@storybook/angular';

import type { AlertComponent } from '@shot-there/components';

export const Default: StoryObj<AlertComponent & { text: string }> = {
  args: {
    tone: 'warning',
    title: 'Prices may be out of date',
    text: 'We last checked these prices 225 days ago. Confirm with the studio before you book.',
    role: 'status',
    banner: false,
    dismissible: false,
  },
  argTypes: {
    tone: { control: 'select', options: ['info', 'success', 'warning', 'danger'] },
    role: { control: 'inline-radio', options: ['status', 'alert', null] },
  },
  render: (args) => ({
    props: args,
    template: `
      <st-alert
        [tone]="tone"
        [title]="title"
        [role]="role"
        [banner]="banner"
        [dismissible]="dismissible"
      >{{ text }}</st-alert>
    `,
  }),
};
