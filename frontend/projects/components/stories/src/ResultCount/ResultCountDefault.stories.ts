import type { StoryObj } from '@storybook/angular';

import type { ResultCountComponent } from '@shot-there/components';

export const Default: StoryObj<ResultCountComponent> = {
  args: {
    text: '7 studios',
    srSuffix: null,
  },
  render: (args) => ({
    props: args,
    template: `<st-result-count [text]="text" [srSuffix]="srSuffix" />`,
  }),
};
