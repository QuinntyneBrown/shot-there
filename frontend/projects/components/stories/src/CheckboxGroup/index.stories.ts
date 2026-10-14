import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { CheckboxGroupComponent, SelectComponent } from '@shot-there/components';

import descriptionMd from './CheckboxGroupDescription.md';
import bestPracticesMd from './CheckboxGroupBestPractices.md';

export { Default } from './CheckboxGroupDefault.stories';
export { Filter } from './CheckboxGroupFilter.stories';
export { Invalid } from './CheckboxGroupInvalid.stories';
export { Disabled } from './CheckboxGroupDisabled.stories';
export { ReactiveForm } from './CheckboxGroupReactiveForm.stories';

export default {
  title: 'Components/Checkbox Group',
  component: CheckboxGroupComponent,
  decorators: [
    moduleMetadata({ imports: [CheckboxGroupComponent, SelectComponent, ReactiveFormsModule] }),
  ],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<CheckboxGroupComponent>;
