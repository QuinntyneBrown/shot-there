import type { StoryObj } from '@storybook/angular';

import type { EmptyStateComponent } from '@shot-there/components';

export const Default: StoryObj<EmptyStateComponent> = {
  args: {
    title: 'No studio reviews yet',
    text: 'The first reviews are being shot now. Each one goes up only after a full test shoot.',
    icon: 'camera',
    tone: 'neutral',
    compact: false,
    headingLevel: 2,
  },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'error'] },
    icon: {
      control: 'select',
      options: [null, 'camera', 'tree', 'search', 'danger', 'success', 'list'],
    },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4] },
  },
  render: (args) => ({
    props: args,
    template: `
      <st-empty-state
        [title]="title"
        [text]="text"
        [icon]="icon"
        [tone]="tone"
        [compact]="compact"
        [headingLevel]="headingLevel"
      >
        <a st-button slot="actions" href="#/spots">Browse outdoor spots</a>
      </st-empty-state>
    `,
  }),
};
