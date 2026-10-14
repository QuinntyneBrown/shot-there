import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  BreadcrumbComponent,
  SiteHeaderComponent,
  SkipLinkComponent,
} from '@shot-there/components';

import descriptionMd from './SkipLinkDescription.md';
import bestPracticesMd from './SkipLinkBestPractices.md';

export { Default } from './SkipLinkDefault.stories';
export { InPageShell } from './SkipLinkInPageShell.stories';

export default {
  title: 'Components/Skip Link',
  component: SkipLinkComponent,
  decorators: [
    moduleMetadata({ imports: [SkipLinkComponent, SiteHeaderComponent, BreadcrumbComponent] }),
  ],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<SkipLinkComponent>;
