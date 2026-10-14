import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { FilterTriggerComponent } from '@shot-there/components';

import descriptionMd from './FilterTriggerDescription.md';
import bestPracticesMd from './FilterTriggerBestPractices.md';

export { Default } from './FilterTriggerDefault.stories';
export { WithCount } from './FilterTriggerWithCount.stories';
export { Expanded } from './FilterTriggerExpanded.stories';
export { Disabled } from './FilterTriggerDisabled.stories';

export default {
  title: 'Components/Filter Trigger',
  component: FilterTriggerComponent,
  decorators: [moduleMetadata({ imports: [FilterTriggerComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<FilterTriggerComponent>;
