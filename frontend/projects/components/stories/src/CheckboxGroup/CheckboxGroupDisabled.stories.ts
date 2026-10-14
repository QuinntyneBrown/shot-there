import type { StoryObj } from '@storybook/angular';
import { FormControl } from '@angular/forms';

import type { CheckboxGroupComponent } from '@shot-there/components';

export const Disabled: StoryObj<CheckboxGroupComponent> = {
  render: () => ({
    props: {
      gear: new FormControl({ value: ['lights', 'stands'], disabled: true }),
      gearOptions: [
        { value: 'lights', label: 'Lights' },
        { value: 'modifiers', label: 'Modifiers' },
        { value: 'stands', label: 'Stands' },
        { value: 'backdrops', label: 'Backdrops' },
      ],
      useOptions: [
        { value: 'engagement', label: 'Engagement' },
        { value: 'family', label: 'Family' },
        { value: 'video', label: 'Video', disabled: true },
      ],
    },
    template: `
      <div class="stack stack--lg">
        <st-checkbox-group label="Included gear" appearance="filter" [options]="gearOptions" [formControl]="gear" />
        <st-checkbox-group label="Use case" appearance="filter" [options]="useOptions" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The forms API disables the whole group; `disabled` on a `ChoiceOption` disables one box.',
      },
    },
  },
};
