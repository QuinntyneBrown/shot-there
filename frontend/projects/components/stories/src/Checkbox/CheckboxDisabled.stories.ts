import type { StoryObj } from '@storybook/angular';
import { FormControl } from '@angular/forms';

import type { CheckboxComponent } from '@shot-there/components';

export const Disabled: StoryObj<CheckboxComponent> = {
  render: () => ({
    props: {
      ticked: new FormControl({ value: true, disabled: true }),
      unticked: new FormControl({ value: false, disabled: true }),
    },
    template: `
      <div class="stack stack--sm">
        <st-checkbox label="20 A circuits available" [formControl]="ticked" />
        <st-checkbox label="Cyc wall" [formControl]="unticked" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Disabled through the forms API, ticked and unticked.',
      },
    },
  },
};
