import type { StoryObj } from '@storybook/angular';

import type { IconComponent, IconName } from '@shot-there/components';

const names: readonly IconName[] = [
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
];

export const Sheet: StoryObj<IconComponent> = {
  render: () => ({
    props: { names },
    template: `
      <ul class="cluster" style="list-style: none; padding: 0">
        @for (name of names; track name) {
          <li class="stack" style="align-items: center; width: 6rem; text-align: center">
            <st-icon [name]="name" size="lg" />
            <code>{{ name }}</code>
          </li>
        }
      </ul>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Every `IconName` on the sheet, drawn at `lg` with its name beside it.',
      },
    },
  },
};
