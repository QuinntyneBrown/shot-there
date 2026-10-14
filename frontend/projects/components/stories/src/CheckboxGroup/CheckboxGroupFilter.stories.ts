import type { StoryObj } from '@storybook/angular';
import { FormControl } from '@angular/forms';

import type { CheckboxGroupComponent } from '@shot-there/components';

export const Filter: StoryObj<CheckboxGroupComponent> = {
  render: () => ({
    props: {
      hoods: new FormControl(['junction', 'leslieville']),
      hoodOptions: [
        { value: 'bloordale', label: 'Bloordale' },
        { value: 'junction', label: 'Junction' },
        { value: 'kensington', label: 'Kensington Market' },
        { value: 'leslieville', label: 'Leslieville' },
        { value: 'liberty-village', label: 'Liberty Village' },
      ],
      lightOptions: [
        {
          value: 'natural-light',
          label: 'Natural light',
          description: 'At least medium at some time of day',
        },
        { value: 'cyc', label: 'Cyc wall' },
      ],
      spaceOptions: [
        { value: '', label: 'Any size' },
        { value: '20', label: '20 m² or more' },
        { value: '30', label: '30 m² or more' },
      ],
    },
    template: `
      <div class="stack stack--lg" style="max-width: 320px">
        <st-checkbox-group label="Neighbourhood" name="hood" appearance="filter" [options]="hoodOptions" [formControl]="hoods" />
        <st-checkbox-group label="Space and light" name="light" appearance="filter" [options]="lightOptions">
          <st-select label="Minimum usable space" name="space" [options]="spaceOptions" />
        </st-checkbox-group>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`appearance="filter"` is the filters sheet and sidebar look; content projected into the group, such as a select, follows the boxes inside the fieldset.',
      },
    },
  },
};
