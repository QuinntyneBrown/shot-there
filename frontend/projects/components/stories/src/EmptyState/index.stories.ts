import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ButtonComponent, EmptyStateComponent, IconComponent } from '@shot-there/components';

import descriptionMd from './EmptyStateDescription.md';
import bestPracticesMd from './EmptyStateBestPractices.md';

export { Default } from './EmptyStateDefault.stories';
export { NoResults } from './EmptyStateNoResults.stories';
export { ErrorState } from './EmptyStateErrorState.stories';
export { Compact } from './EmptyStateCompact.stories';
export { WithoutIcon } from './EmptyStateWithoutIcon.stories';

export default {
  title: 'Components/Empty State',
  component: EmptyStateComponent,
  decorators: [moduleMetadata({ imports: [EmptyStateComponent, ButtonComponent, IconComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<EmptyStateComponent>;
