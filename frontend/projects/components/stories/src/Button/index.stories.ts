import type { Meta } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ButtonComponent, IconComponent } from '@shot-there/components';

import descriptionMd from './ButtonDescription.md';
import bestPracticesMd from './ButtonBestPractices.md';

export { Default } from './ButtonDefault.stories';
export { Variant } from './ButtonVariant.stories';
export { Size } from './ButtonSize.stories';
export { IconOnly } from './ButtonIconOnly.stories';
export { Block } from './ButtonBlock.stories';
export { Busy } from './ButtonBusy.stories';
export { Disabled } from './ButtonDisabled.stories';
export { Toggle } from './ButtonToggle.stories';
export { AsLink } from './ButtonAsLink.stories';

export default {
  title: 'Components/Button',
  component: ButtonComponent,
  decorators: [moduleMetadata({ imports: [ButtonComponent, IconComponent] })],
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
} as Meta<ButtonComponent>;
