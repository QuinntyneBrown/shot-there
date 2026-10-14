import type { StoryObj } from '@storybook/angular';

import type { LinkComponent } from '@shot-there/components';

export const Default: StoryObj<LinkComponent & { label: string; href: string }> = {
  args: {
    label: 'Read the full review',
    href: '#/studios/kensington-window-room',
    standalone: false,
    external: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <a st-link [href]="href" [standalone]="standalone" [external]="external">{{ label }}</a>
    `,
  }),
};
