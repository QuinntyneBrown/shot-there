import type { StoryObj } from '@storybook/angular';

import type { DisclosureComponent } from '@shot-there/components';

export const Default: StoryObj<DisclosureComponent & { statement: string }> = {
  args: {
    title: 'How this session was paid for',
    statement: 'I paid the full rate for this session. No studio pays for placement or scores.',
  },
  render: (args) => ({
    props: args,
    template: `
      <st-disclosure [title]="title">
        {{ statement }}
        <a st-link href="#/editorial-policy">Editorial policy</a>
      </st-disclosure>
    `,
  }),
};
