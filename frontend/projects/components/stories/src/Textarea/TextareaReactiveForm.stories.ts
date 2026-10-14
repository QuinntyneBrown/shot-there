import type { StoryObj } from '@storybook/angular';
import { FormControl, Validators } from '@angular/forms';

import type { TextareaComponent } from '@shot-there/components';

export const ReactiveForm: StoryObj<TextareaComponent> = {
  render: () => {
    const intro = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    });
    return {
      props: { intro },
      template: `
        <div class="stack" style="max-width: 480px">
          <st-textarea
            label="Introduction"
            [maxlength]="120"
            [formControl]="intro"
            [error]="intro.touched && intro.hasError('required') ? 'Write an introduction' : intro.hasError('maxlength') ? 'Keep the introduction to 120 characters' : null"
          />
          <p>Value: <output>{{ intro.value }}</output></p>
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          'As a form control the textarea reports every keystroke; the page turns validator results into `error`.',
      },
    },
  },
};
