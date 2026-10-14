import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { JsonPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent, TextFieldComponent } from '@shot-there/components';

import descriptionMd from './TextFieldDescription.md';
import bestPracticesMd from './TextFieldBestPractices.md';

export { Default } from './TextFieldDefault.stories';
export { Types } from './TextFieldTypes.stories';
export { Validation } from './TextFieldValidation.stories';
export { OptionalAndDisabled } from './TextFieldOptionalAndDisabled.stories';
export { ReactiveForm } from './TextFieldReactiveForm.stories';

export default {
  title: 'Components/Text Field',
  component: TextFieldComponent,
  decorators: [
    moduleMetadata({
      imports: [TextFieldComponent, ButtonComponent, ReactiveFormsModule, JsonPipe],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<TextFieldComponent>;
