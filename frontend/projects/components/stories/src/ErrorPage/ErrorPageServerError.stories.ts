import type { StoryObj } from '@storybook/angular';

import type { ErrorPageComponent } from '@shot-there/components';

export const ServerError: StoryObj<ErrorPageComponent> = {
  render: () => ({
    template: `
      <st-error-page title="Something went wrong on our side" reference="Reference 7f3a-91c2">
        <p>
          Try again in a minute. If it keeps happening, tell us at
          <a href="mailto:hello@shotthere.ca">hello@shotthere.ca</a> and quote this reference.
        </p>
        <a st-button slot="actions" variant="primary" href="#/studios/the-junction-loft">Try again</a>
        <a st-button slot="actions" href="#/">Go to the home page</a>
      </st-error-page>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'No `code`; a paragraph with a mail link in the default slot and a `reference` to quote when reporting it.',
      },
    },
  },
};
