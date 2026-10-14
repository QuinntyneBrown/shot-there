import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { LinkComponent } from '@shot-there/components';

import descriptionMd from './LinkDescription.md';
import bestPracticesMd from './LinkBestPractices.md';

export { Default } from './LinkDefault.stories';
export { Inline } from './LinkInline.stories';
export { Standalone } from './LinkStandalone.stories';
export { External } from './LinkExternal.stories';

export default {
  title: 'Components/Link',
  component: LinkComponent,
  decorators: [moduleMetadata({ imports: [LinkComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<LinkComponent>;
