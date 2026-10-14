import type { StoryObj } from '@storybook/angular';
import { FormControl } from '@angular/forms';

import type { TextareaComponent } from '@shot-there/components';

export const Disabled: StoryObj<TextareaComponent> = {
  render: () => ({
    props: {
      transit: new FormControl({
        value: 'TTC 504 King streetcar to Strachan Ave, then a five-minute walk.',
        disabled: true,
      }),
    },
    template: `<st-textarea style="max-width: 480px" label="Transit" [rows]="2" [formControl]="transit" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'A control disabled through the forms API greys the textarea and keeps its text.',
      },
    },
  },
};
