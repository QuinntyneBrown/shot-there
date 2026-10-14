import type { StoryObj } from '@storybook/angular';

import type { IconComponent } from '@shot-there/components';

export const Default: StoryObj<IconComponent> = {
  args: {
    name: 'map-pin',
    size: 'md',
  },
  argTypes: {
    name: {
      control: 'select',
      options: [
        'search',
        'menu',
        'close',
        'chevron-left',
        'chevron-right',
        'chevron-down',
        'filters',
        'map-pin',
        'check',
        'mail',
        'lock',
        'sign-out',
        'home',
        'plus',
        'edit',
        'trash',
        'arrow-up',
        'arrow-down',
        'camera',
        'upload',
        'eye',
        'clock',
        'refresh',
        'offline',
        'info',
        'success',
        'warning',
        'danger',
        'external',
        'play',
        'copy',
        'image',
        'image-failed',
        'tree',
        'compare',
        'guide',
        'list',
      ],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
  },
  render: (args) => ({
    props: args,
    template: `<st-icon [name]="name" [size]="size" />`,
  }),
};
