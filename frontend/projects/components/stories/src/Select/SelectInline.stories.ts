import type { StoryObj } from '@storybook/angular';
import { FormControl } from '@angular/forms';

import type { SelectComponent } from '@shot-there/components';

export const Inline: StoryObj<SelectComponent> = {
  render: () => ({
    props: {
      sort: new FormControl('recent'),
      options: [
        { value: 'recent', label: 'Most recent review' },
        { value: 'cost', label: 'All-in cost, low to high' },
        { value: 'score', label: 'Overall score, high to low' },
      ],
    },
    template: `<st-select label="Sort by" name="sort" inline [options]="options" [formControl]="sort" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: '`inline` sets the label beside the select, as in the studio list head.',
      },
    },
  },
};
