import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { SelectComponent } from '@shot-there/components';

import descriptionMd from './SelectDescription.md';
import bestPracticesMd from './SelectBestPractices.md';

export { Default } from './SelectDefault.stories';
export { Inline } from './SelectInline.stories';
export { Invalid } from './SelectInvalid.stories';
export { Disabled } from './SelectDisabled.stories';
export { ReactiveForm } from './SelectReactiveForm.stories';

export default {
  title: 'Components/Select',
  component: SelectComponent,
  decorators: [moduleMetadata({ imports: [SelectComponent, ReactiveFormsModule] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<SelectComponent>;
