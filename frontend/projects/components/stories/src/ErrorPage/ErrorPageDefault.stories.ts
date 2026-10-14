import type { StoryObj } from '@storybook/angular';

import type { ErrorPageComponent } from '@shot-there/components';

export const Default: StoryObj<ErrorPageComponent> = {
  args: {
    code: 'Error 404',
    title: "We couldn't find that page",
    text: "It may have been renamed, or the location isn't published.",
    reference: null,
  },
  render: (args) => ({
    props: args,
    template: `
      <st-error-page [code]="code" [title]="title" [text]="text" [reference]="reference">
        <a st-button slot="actions" variant="primary" href="#/">Go to the home page</a>
        <a st-button slot="actions" href="#/studios">Browse studios</a>
      </st-error-page>
    `,
  }),
};
