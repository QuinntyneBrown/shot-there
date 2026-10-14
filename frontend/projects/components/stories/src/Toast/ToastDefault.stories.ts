import type { StoryObj } from '@storybook/angular';

import type { ToastOptions, ToastRegionComponent } from '@shot-there/components';

import { toastStage } from './toast-stage';

const stage = toastStage();

export const Default: StoryObj<ToastRegionComponent & ToastOptions> = {
  decorators: [stage.decorator],
  args: {
    tone: 'success',
    title: 'Link copied',
    text: 'Anyone with the link sees these 3 studios side by side.',
  },
  argTypes: {
    tone: { control: 'select', options: ['info', 'success', 'warning', 'danger'] },
  },
  render: (args) => ({
    props: {
      raise: () => stage.raise({ tone: args.tone, title: args.title, text: args.text }),
    },
    template: `
      <div style="min-height: 16rem; transform: translateZ(0)">
        <button st-button type="button" (click)="raise()">Raise toast</button>
        <st-toast-region />
      </div>
    `,
  }),
};
