import type { StoryObj } from '@storybook/angular';

import type { ButtonComponent } from '@shot-there/components';

export const Default: StoryObj<ButtonComponent & { label: string }> = {
  args: {
    label: 'Apply filters',
    variant: 'secondary',
    size: 'md',
    block: false,
    iconOnly: false,
    busy: false,
    softDisabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['secondary', 'primary', 'ghost', 'ghost-danger', 'link', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    props: args,
    template: `
      <button
        st-button
        type="button"
        [variant]="variant"
        [size]="size"
        [block]="block"
        [busy]="busy"
        [softDisabled]="softDisabled"
      >{{ label }}</button>
    `,
  }),
};
