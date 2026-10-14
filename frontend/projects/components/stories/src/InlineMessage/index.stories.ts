import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { InlineMessageComponent } from '@shot-there/components';

import descriptionMd from './InlineMessageDescription.md';
import bestPracticesMd from './InlineMessageBestPractices.md';

export { Default } from './InlineMessageDefault.stories';
export { Help } from './InlineMessageHelp.stories';
export { ErrorMessage } from './InlineMessageErrorMessage.stories';
export { ErrorStack } from './InlineMessageErrorStack.stories';

export default {
  title: 'Components/Inline Message',
  component: InlineMessageComponent,
  decorators: [moduleMetadata({ imports: [InlineMessageComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<InlineMessageComponent>;
