import type { StoryObj } from '@storybook/angular';
import { FormControl } from '@angular/forms';

import type { TextFieldComponent } from '@shot-there/components';

export const OptionalAndDisabled: StoryObj<TextFieldComponent> = {
  render: () => ({
    props: {
      provider: new FormControl({ value: '', disabled: true }),
    },
    template: `
      <div class="stack" style="max-width: 360px">
        <st-text-field label="Backdrops" optional />
        <st-text-field
          label="Provided by"
          optional
          optionalLabel="(needed when discounted or comped)"
          [formControl]="provider"
        />
        <st-text-field label="Email" type="email" readonly />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Required is the default, so only `optional` fields are marked; disabled comes from the forms API and `readonly` keeps the value while a form submits.',
      },
    },
  },
};
