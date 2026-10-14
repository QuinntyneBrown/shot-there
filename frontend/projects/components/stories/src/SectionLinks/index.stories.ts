import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SectionLinksComponent } from '@shot-there/components';

import descriptionMd from './SectionLinksDescription.md';
import bestPracticesMd from './SectionLinksBestPractices.md';

export { Default } from './SectionLinksDefault.stories';
export { Admin } from './SectionLinksAdmin.stories';
export { NoMeta } from './SectionLinksNoMeta.stories';

export default {
  title: 'Components/Section Links',
  component: SectionLinksComponent,
  decorators: [moduleMetadata({ imports: [SectionLinksComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<SectionLinksComponent>;
