import type { StoryObj } from '@storybook/angular';
import { FormControl } from '@angular/forms';

import type { CheckboxComponent } from '@shot-there/components';

export const ReactiveForm: StoryObj<CheckboxComponent> = {
  render: () => ({
    props: { has20A: new FormControl(false, { nonNullable: true }) },
    template: `
      <div class="stack stack--sm">
        <st-checkbox label="20 A circuits available" help="Needed for strobes." [formControl]="has20A" />
        <p>Value: <output>{{ has20A.value }}</output></p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'As a form control the checkbox reports `true` or `false`.',
      },
    },
  },
};
