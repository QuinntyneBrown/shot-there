import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SegmentedControlComponent } from '@shot-there/components';

import descriptionMd from './SegmentedControlDescription.md';
import bestPracticesMd from './SegmentedControlBestPractices.md';

export { Default } from './SegmentedControlDefault.stories';
export { FiltersList } from './SegmentedControlFiltersList.stories';
export { ViewAs } from './SegmentedControlViewAs.stories';

export default {
  title: 'Components/Segmented Control',
  component: SegmentedControlComponent,
  decorators: [moduleMetadata({ imports: [SegmentedControlComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<SegmentedControlComponent>;
