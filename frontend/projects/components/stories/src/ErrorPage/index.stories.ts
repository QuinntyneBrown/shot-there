import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ButtonComponent, ErrorPageComponent } from '@shot-there/components';

import descriptionMd from './ErrorPageDescription.md';
import bestPracticesMd from './ErrorPageBestPractices.md';

export { Default } from './ErrorPageDefault.stories';
export { ServerError } from './ErrorPageServerError.stories';

export default {
  title: 'Components/Error Page',
  component: ErrorPageComponent,
  decorators: [moduleMetadata({ imports: [ErrorPageComponent, ButtonComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<ErrorPageComponent>;
