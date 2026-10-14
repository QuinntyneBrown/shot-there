import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ButtonComponent, SiteHeaderComponent } from '@shot-there/components';

import descriptionMd from './SiteHeaderDescription.md';
import bestPracticesMd from './SiteHeaderBestPractices.md';

export { Default } from './SiteHeaderDefault.stories';
export { Admin } from './SiteHeaderAdmin.stories';
export { ExternalLink } from './SiteHeaderExternalLink.stories';
export { Phone } from './SiteHeaderPhone.stories';

export default {
  title: 'Components/Site Header',
  component: SiteHeaderComponent,
  decorators: [moduleMetadata({ imports: [SiteHeaderComponent, ButtonComponent] })],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<SiteHeaderComponent>;
