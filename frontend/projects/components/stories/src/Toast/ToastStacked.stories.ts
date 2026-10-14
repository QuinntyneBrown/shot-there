import type { StoryObj } from '@storybook/angular';

import type { ToastRegionComponent } from '@shot-there/components';

import { toastStage } from './toast-stage';

const stage = toastStage();

export const Stacked: StoryObj<ToastRegionComponent> = {
  decorators: [stage.decorator],
  render: () => ({
    props: {
      raiseFour: () => {
        stage.raise({ tone: 'info', title: 'Saved Kensington Window Room' });
        stage.raise({ tone: 'info', title: 'Saved with a new address' });
        stage.raise({ tone: 'success', title: 'Liberty Village Loft is published' });
        stage.raise({ tone: 'danger', title: "Couldn't save Trinity Bellwoods" });
      },
    },
    template: `
      <div style="min-height: 26rem; transform: translateZ(0)">
        <button st-button type="button" (click)="raiseFour()">Raise four toasts</button>
        <st-toast-region />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The region shows the newest three, oldest at the top; raising four leaves the first held until one is dismissed.',
      },
    },
  },
};
