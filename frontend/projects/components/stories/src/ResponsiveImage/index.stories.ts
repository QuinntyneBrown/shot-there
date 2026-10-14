import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  ButtonComponent,
  FallbackImageDirective,
  ResponsiveImageComponent,
} from '@shot-there/components';

import descriptionMd from './ResponsiveImageDescription.md';
import bestPracticesMd from './ResponsiveImageBestPractices.md';

export { Default } from './ResponsiveImageDefault.stories';
export { Hero } from './ResponsiveImageHero.stories';
export { Decorative } from './ResponsiveImageDecorative.stories';
export { Failed } from './ResponsiveImageFailed.stories';
export { Recovered } from './ResponsiveImageRecovered.stories';
export { FallbackImage } from './ResponsiveImageFallbackImage.stories';

export default {
  title: 'Components/Responsive Image',
  component: ResponsiveImageComponent,
  decorators: [
    moduleMetadata({
      imports: [ResponsiveImageComponent, FallbackImageDirective, ButtonComponent],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<ResponsiveImageComponent>;
