import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { AlertComponent, ButtonComponent, IconComponent } from '@shot-there/components';

import descriptionMd from './AlertDescription.md';
import bestPracticesMd from './AlertBestPractices.md';

export { Default } from './AlertDefault.stories';
export { Tone } from './AlertTone.stories';
export { BodyOnly } from './AlertBodyOnly.stories';
export { WithAction } from './AlertWithAction.stories';
export { Dismissible } from './AlertDismissible.stories';
export { Banner } from './AlertBanner.stories';

export default {
  title: 'Components/Alert',
  component: AlertComponent,
  decorators: [moduleMetadata({ imports: [AlertComponent, ButtonComponent, IconComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<AlertComponent>;
