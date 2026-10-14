import type { StoryObj } from '@storybook/angular';
import { FormControl } from '@angular/forms';

import type { RadioGroupComponent } from '@shot-there/components';

export const Disabled: StoryObj<RadioGroupComponent> = {
  render: () => ({
    props: {
      permit: new FormControl({ value: '', disabled: true }),
      permitOptions: [
        { value: '', label: 'Any' },
        { value: 'none-needed', label: 'No permit needed for the selected use' },
      ],
      parkingOptions: [
        { value: '', label: 'Any' },
        { value: 'on-site', label: 'On-site' },
        { value: 'street', label: 'Street', disabled: true },
      ],
    },
    template: `
      <div class="stack stack--lg">
        <st-radio-group label="Permit" appearance="filter" [options]="permitOptions" [formControl]="permit" />
        <st-radio-group label="Parking" appearance="filter" [options]="parkingOptions" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The forms API disables the whole group; `disabled` on a `ChoiceOption` disables one radio.',
      },
    },
  },
};
