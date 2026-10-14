import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ButtonComponent, PageHeaderComponent } from '@shot-there/components';

import descriptionMd from './PageHeaderDescription.md';
import bestPracticesMd from './PageHeaderBestPractices.md';

export { Default } from './PageHeaderDefault.stories';
export { SubtitleAndActions } from './PageHeaderSubtitleAndActions.stories';
export { Loading } from './PageHeaderLoading.stories';

export default {
  title: 'Components/Page Header',
  component: PageHeaderComponent,
  decorators: [moduleMetadata({ imports: [PageHeaderComponent, ButtonComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<PageHeaderComponent>;
