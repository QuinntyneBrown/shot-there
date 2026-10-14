import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { DisclosureComponent, LinkComponent } from '@shot-there/components';

import descriptionMd from './DisclosureDescription.md';
import bestPracticesMd from './DisclosureBestPractices.md';

export { Default } from './DisclosureDefault.stories';
export { Provided } from './DisclosureProvided.stories';
export { Spot } from './DisclosureSpot.stories';

export default {
  title: 'Components/Disclosure',
  component: DisclosureComponent,
  decorators: [moduleMetadata({ imports: [DisclosureComponent, LinkComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<DisclosureComponent>;
