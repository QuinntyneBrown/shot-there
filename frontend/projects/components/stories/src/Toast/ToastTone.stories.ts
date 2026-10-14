import type { StoryObj } from '@storybook/angular';

import type { ToastRegionComponent } from '@shot-there/components';

import { toastStage } from './toast-stage';

const stage = toastStage();

export const Tone: StoryObj<ToastRegionComponent> = {
  decorators: [stage.decorator],
  render: () => ({
    props: {
      info: () =>
        stage.raise({
          tone: 'info',
          title: 'Saved with a new address',
          text: '/studios/annex-attic-studio-2 — annex-attic-studio was already taken.',
        }),
      success: () =>
        stage.raise({
          tone: 'success',
          title: 'Link copied',
          text: 'Anyone with the link sees these 3 studios side by side.',
        }),
      warning: () =>
        stage.raise({
          tone: 'warning',
          title: 'You can compare up to 4 studios',
          text: 'Remove one from the bar to add Ossington Blackbox.',
        }),
      danger: () =>
        stage.raise({
          tone: 'danger',
          title: "Couldn't copy the link",
          text: "Copy the address from your browser's address bar instead.",
        }),
    },
    template: `
      <div style="min-height: 22rem; transform: translateZ(0)">
        <div class="cluster">
          <button st-button type="button" (click)="info()">Raise info</button>
          <button st-button type="button" (click)="success()">Raise success</button>
          <button st-button type="button" (click)="warning()">Raise warning</button>
          <button st-button type="button" (click)="danger()">Raise danger</button>
        </div>
        <st-toast-region />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Info, success and warning count down for 8 seconds; danger is announced at once and stays until dismissed.',
      },
    },
  },
};
