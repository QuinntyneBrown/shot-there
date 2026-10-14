import type { StoryObj } from '@storybook/angular';
import { FormControl } from '@angular/forms';

import type { RadioGroupComponent } from '@shot-there/components';

export const Filter: StoryObj<RadioGroupComponent> = {
  render: () => ({
    props: {
      parking: new FormControl('on-site'),
      options: [
        { value: '', label: 'Any' },
        { value: 'on-site', label: 'On-site' },
        { value: 'street', label: 'Street' },
        { value: 'none', label: 'None' },
      ],
    },
    template: `
      <st-radio-group label="Parking" name="parking" appearance="filter" [options]="options" [formControl]="parking" />
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '`appearance="filter"` is the filters look; "Any" carries the value `\'\'`.',
      },
    },
  },
};
