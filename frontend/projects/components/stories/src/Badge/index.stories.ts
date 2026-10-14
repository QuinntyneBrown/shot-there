import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { BadgeComponent } from '@shot-there/components';

import descriptionMd from './BadgeDescription.md';
import bestPracticesMd from './BadgeBestPractices.md';

export { Default } from './BadgeDefault.stories';
export { Tone } from './BadgeTone.stories';
export { Solid } from './BadgeSolid.stories';
export { InContext } from './BadgeInContext.stories';

export default {
  title: 'Components/Badge',
  component: BadgeComponent,
  decorators: [moduleMetadata({ imports: [BadgeComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<BadgeComponent>;
