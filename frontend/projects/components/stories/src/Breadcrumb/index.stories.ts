import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { BreadcrumbComponent } from '@shot-there/components';

import descriptionMd from './BreadcrumbDescription.md';
import bestPracticesMd from './BreadcrumbBestPractices.md';

export { Default } from './BreadcrumbDefault.stories';
export { Loading } from './BreadcrumbLoading.stories';
export { NoCurrent } from './BreadcrumbNoCurrent.stories';
export { Collapsed } from './BreadcrumbCollapsed.stories';

export default {
  title: 'Components/Breadcrumb',
  component: BreadcrumbComponent,
  decorators: [moduleMetadata({ imports: [BreadcrumbComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<BreadcrumbComponent>;
