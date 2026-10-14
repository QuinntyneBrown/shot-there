import type { StoryObj } from '@storybook/angular';

import type { StatusComponent } from '@shot-there/components';

export const Default: StoryObj<StatusComponent & { label: string }> = {
  args: {
    status: 'draft',
    label: 'Draft',
  },
  argTypes: {
    status: { control: 'inline-radio', options: ['draft', 'published'] },
  },
  render: (args) => ({
    props: args,
    template: `<st-status [status]="status">{{ label }}</st-status>`,
  }),
};
