import type { StoryObj } from '@storybook/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import type { TextFieldComponent } from '@shot-there/components';

export const ReactiveForm: StoryObj<TextFieldComponent> = {
  render: () => {
    const form = new FormGroup({
      name: new FormControl('Liberty Village Loft', {
        nonNullable: true,
        validators: Validators.required,
      }),
      rate: new FormControl('', { nonNullable: true, validators: Validators.min(0) }),
    });
    return {
      props: { form, submit: () => form.markAllAsTouched() },
      template: `
        <form class="stack" style="max-width: 360px" [formGroup]="form" (ngSubmit)="submit()">
          <st-text-field
            label="Name"
            formControlName="name"
            help="Shown on the card."
            [error]="form.controls.name.touched && form.controls.name.invalid ? 'Enter a name' : null"
          />
          <st-text-field
            label="Hourly rate"
            type="number"
            inputmode="decimal"
            min="0"
            step="0.01"
            prefix="$"
            formControlName="rate"
            [error]="form.controls.rate.touched && form.controls.rate.invalid ? 'Enter an amount of 0 or more' : null"
          />
          <div class="cluster">
            <button st-button variant="primary" type="submit">Save changes</button>
          </div>
          <p>Value: <output>{{ form.value | json }}</output></p>
        </form>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          'As a form control the field reports what is typed; the page maps validator results to `error`. Clear the name or enter -5, then save.',
      },
    },
  },
};
