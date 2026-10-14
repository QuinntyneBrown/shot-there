import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SiteFooterComponent } from '@shot-there/components';

import descriptionMd from './SiteFooterDescription.md';
import bestPracticesMd from './SiteFooterBestPractices.md';

export { Default } from './SiteFooterDefault.stories';
export { Minimal } from './SiteFooterMinimal.stories';
export { Phone } from './SiteFooterPhone.stories';

export default {
  title: 'Components/Site Footer',
  component: SiteFooterComponent,
  decorators: [moduleMetadata({ imports: [SiteFooterComponent] })],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<SiteFooterComponent>;
