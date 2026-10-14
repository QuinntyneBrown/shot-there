import type { StoryObj } from '@storybook/angular';
import { FormControl, FormGroup } from '@angular/forms';

import type { RadioGroupComponent } from '@shot-there/components';

export const ReactiveForm: StoryObj<RadioGroupComponent> = {
  render: () => {
    const form = new FormGroup({
      disclosure: new FormControl('paid_in_full', { nonNullable: true }),
      provider: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    });
    form.controls.disclosure.valueChanges.subscribe((value) => {
      if (value === 'paid_in_full') form.controls.provider.disable();
      else form.controls.provider.enable();
    });
    return {
      props: {
        form,
        options: [
          { value: 'paid_in_full', label: 'I paid the full rate' },
          { value: 'discounted', label: 'Discounted' },
          { value: 'comped', label: 'Comped (free of charge)' },
        ],
      },
      template: `
        <form class="stack" style="max-width: 360px" [formGroup]="form">
          <st-radio-group label="How was this session paid for?" [options]="options" formControlName="disclosure" />
          <st-text-field
            label="Provided by"
            optional
            optionalLabel="(needed when discounted or comped)"
            formControlName="provider"
          />
          <p>Value: <output>{{ form.controls.disclosure.value }}</output></p>
        </form>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          'As a form control the group reports the chosen value; here the page enables "Provided by" when the session was discounted or comped.',
      },
    },
  },
};
