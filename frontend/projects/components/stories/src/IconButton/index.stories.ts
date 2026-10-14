import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { IconButtonComponent } from '@shot-there/components';

import descriptionMd from './IconButtonDescription.md';
import bestPracticesMd from './IconButtonBestPractices.md';

export { Default } from './IconButtonDefault.stories';
export { Outline } from './IconButtonOutline.stories';
export { Toggle } from './IconButtonToggle.stories';
export { AsLink } from './IconButtonAsLink.stories';
export { Disabled } from './IconButtonDisabled.stories';

export default {
  title: 'Components/Icon Button',
  component: IconButtonComponent,
  decorators: [moduleMetadata({ imports: [IconButtonComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<IconButtonComponent>;
