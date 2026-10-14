import type { StoryObj } from '@storybook/angular';
import { FormControl } from '@angular/forms';

import type { TextareaComponent } from '@shot-there/components';

export const Counter: StoryObj<TextareaComponent> = {
  render: () => ({
    props: {
      withinLimit: new FormControl('North light all morning.'),
      overLimit: new FormControl('East windows give clean morning light for a whole headshot day.'),
    },
    template: `
      <div class="stack" style="max-width: 480px">
        <st-textarea label="Editor's note" labelSuffix="for Kensington Window Room" [rows]="2" [maxlength]="60" [formControl]="withinLimit" />
        <st-textarea label="Editor's note" labelSuffix="for Leslieville Daylight Studio" [rows]="2" [maxlength]="60" [formControl]="overLimit" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`maxlength` adds a counter; past the limit it turns to the danger colour but keeps every character typed.',
      },
    },
  },
};
