import { signal } from '@angular/core';
import type { StoryObj } from '@storybook/angular';

import type { FilterTriggerComponent } from '@shot-there/components';

export const Expanded: StoryObj<FilterTriggerComponent> = {
  render: () => {
    const expanded = signal(true);
    return {
      props: { expanded },
      template: `
        <button
          st-filter-trigger
          type="button"
          count="3"
          [attr.aria-expanded]="expanded()"
          (click)="expanded.set(!expanded())"
        >
          Filters
        </button>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          'While the sheet is open the application sets `aria-expanded="true"`, which draws the ink ring; press it to toggle.',
      },
    },
  },
};
