import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { RadioGroupComponent, TextFieldComponent } from '@shot-there/components';

import descriptionMd from './RadioGroupDescription.md';
import bestPracticesMd from './RadioGroupBestPractices.md';

export { Default } from './RadioGroupDefault.stories';
export { Filter } from './RadioGroupFilter.stories';
export { Invalid } from './RadioGroupInvalid.stories';
export { Disabled } from './RadioGroupDisabled.stories';
export { ReactiveForm } from './RadioGroupReactiveForm.stories';

export default {
  title: 'Components/Radio Group',
  component: RadioGroupComponent,
  decorators: [
    moduleMetadata({ imports: [RadioGroupComponent, TextFieldComponent, ReactiveFormsModule] }),
  ],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<RadioGroupComponent>;
