import type { StoryObj } from '@storybook/angular';
import { FormControl, Validators } from '@angular/forms';

import type { SelectComponent } from '@shot-there/components';

export const ReactiveForm: StoryObj<SelectComponent> = {
  render: () => {
    const morning = new FormControl('', { nonNullable: true, validators: Validators.required });
    return {
      props: {
        morning,
        options: [
          { value: '', label: 'Not set' },
          { value: 'none', label: 'None' },
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'strong', label: 'Strong' },
        ],
      },
      template: `
        <div class="stack" style="max-width: 360px">
          <st-select
            label="Morning"
            labelSuffix="natural light"
            [options]="options"
            [formControl]="morning"
            [error]="morning.touched && morning.invalid ? 'Choose the morning light' : null"
          />
          <p>Value: <output>{{ morning.value }}</output></p>
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          "As a form control the select reports the chosen option's `value`; leave it on Not set and tab away to see the error.",
      },
    },
  },
};
