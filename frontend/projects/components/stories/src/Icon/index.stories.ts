import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  ButtonComponent,
  FilterTriggerComponent,
  IconButtonComponent,
  IconComponent,
} from '@shot-there/components';

import descriptionMd from './IconDescription.md';
import bestPracticesMd from './IconBestPractices.md';

export { Default } from './IconDefault.stories';
export { Size } from './IconSize.stories';
export { Sheet } from './IconSheet.stories';
export { InControls } from './IconInControls.stories';

export default {
  title: 'Components/Icon',
  component: IconComponent,
  decorators: [
    moduleMetadata({
      imports: [IconComponent, ButtonComponent, FilterTriggerComponent, IconButtonComponent],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<IconComponent>;
