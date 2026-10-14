import type { StoryObj } from '@storybook/angular';
import { FormControl } from '@angular/forms';

import type { CheckboxGroupComponent } from '@shot-there/components';

export const ReactiveForm: StoryObj<CheckboxGroupComponent> = {
  render: () => {
    const uses = new FormControl<string[]>([], {
      nonNullable: true,
      validators: (control) => (control.value.length ? null : { required: true }),
    });
    return {
      props: {
        uses,
        options: [
          { value: 'engagement', label: 'Engagement' },
          { value: 'family', label: 'Family' },
          { value: 'portrait', label: 'Portrait' },
          { value: 'brand', label: 'Brand' },
          { value: 'video', label: 'Video' },
        ],
      },
      template: `
        <div class="stack">
          <st-checkbox-group
            label="Best for"
            name="bestUses"
            help="Choose at least one before publishing."
            [options]="options"
            [formControl]="uses"
            [error]="uses.touched && uses.invalid ? 'Choose at least one best use' : null"
          />
          <p>Value: <output>{{ uses.value.join(', ') }}</output></p>
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          'As a form control the group reports the ticked values in option order; untick every box to see the error.',
      },
    },
  },
};
