import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { TagListComponent } from '@shot-there/components';

import descriptionMd from './TagListDescription.md';
import bestPracticesMd from './TagListBestPractices.md';

export { Default } from './TagListDefault.stories';
export { Links } from './TagListLinks.stories';
export { Empty } from './TagListEmpty.stories';

export default {
  title: 'Components/Tag List',
  component: TagListComponent,
  decorators: [moduleMetadata({ imports: [TagListComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<TagListComponent>;
