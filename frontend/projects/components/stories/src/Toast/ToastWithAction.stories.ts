import { signal } from '@angular/core';
import type { StoryObj } from '@storybook/angular';

import type { ToastRegionComponent } from '@shot-there/components';

import { toastStage } from './toast-stage';

const stage = toastStage();

export const WithAction: StoryObj<ToastRegionComponent> = {
  decorators: [stage.decorator],
  render: () => {
    const retries = signal(0);
    return {
      props: {
        retries,
        published: () =>
          stage.raise({
            tone: 'success',
            title: 'Corktown Garage Studio is published',
            text: 'It appears in lists, the map and the sitemap within a minute.',
            actionLabel: 'View public page',
            actionLink: '/studios/corktown-garage-studio',
          }),
        failed: () =>
          stage.raise({
            tone: 'danger',
            title: "Couldn't save Corktown Garage Studio",
            text: 'Your changes are still here. Check your connection and try again.',
            actionLabel: 'Try again',
            action: () => retries.update((n) => n + 1),
          }),
      },
      template: `
        <div class="stack" style="min-height: 18rem; transform: translateZ(0)">
          <div class="cluster">
            <button st-button variant="primary" type="button" (click)="published()">Publish</button>
            <button st-button type="button" (click)="failed()">Save changes</button>
          </div>
          <p>Retries: {{ retries() }}</p>
          <st-toast-region />
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          '`actionLink` makes the action a router link; `action` makes it a button that runs, then dismisses the toast.',
      },
    },
  },
};
