import type { StoryObj } from '@storybook/angular';

import type { TextFieldComponent } from '@shot-there/components';

export const Validation: StoryObj<TextFieldComponent> = {
  render: () => ({
    template: `
      <div class="stack" style="max-width: 360px">
        <st-text-field
          label="Booking link"
          type="url"
          error="Enter a web address that starts with http:// or https://"
          help="The studio's own booking page."
        />
        <st-text-field
          label="Prices last verified"
          type="date"
          warning="You changed a price. Confirm the date you verified it."
          help="Previously 11 Oct 2026. Visitors see a warning after 183 days."
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`error` sets `aria-invalid` and shows before the help; `warning` tints the field without making it invalid, and is hidden while there is an error.',
      },
    },
  },
};
