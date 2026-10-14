import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ButtonComponent, ToastRegionComponent } from '@shot-there/components';

import descriptionMd from './ToastDescription.md';
import bestPracticesMd from './ToastBestPractices.md';

export { Default } from './ToastDefault.stories';
export { Tone } from './ToastTone.stories';
export { WithAction } from './ToastWithAction.stories';
export { Stacked } from './ToastStacked.stories';

export default {
  title: 'Components/Toast',
  component: ToastRegionComponent,
  decorators: [moduleMetadata({ imports: [ToastRegionComponent, ButtonComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<ToastRegionComponent>;
