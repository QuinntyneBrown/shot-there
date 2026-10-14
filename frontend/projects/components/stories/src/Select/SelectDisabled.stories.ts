import type { StoryObj } from '@storybook/angular';
import { FormControl } from '@angular/forms';

import type { SelectComponent } from '@shot-there/components';

export const Disabled: StoryObj<SelectComponent> = {
  render: () => ({
    props: {
      loadIn: new FormControl({ value: 'freight', disabled: true }),
      loadInOptions: [
        { value: 'stairs', label: 'Stairs' },
        { value: 'elevator', label: 'Elevator' },
        { value: 'freight', label: 'Freight elevator' },
        { value: 'ground', label: 'Ground level' },
      ],
      space: new FormControl(''),
      spaceOptions: [
        { value: '', label: 'Any size' },
        { value: '20', label: '20 m² or more' },
        { value: '30', label: '30 m² or more' },
        { value: '50', label: '50 m² or more', disabled: true },
      ],
    },
    template: `
      <div class="stack" style="max-width: 360px">
        <st-select label="Load-in" [options]="loadInOptions" [formControl]="loadIn" />
        <st-select label="Minimum usable space" [options]="spaceOptions" [formControl]="space" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The whole select is disabled through the forms API; a single option is disabled with `disabled` on its `SelectOption`.',
      },
    },
  },
};
