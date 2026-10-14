import { signal } from '@angular/core';
import type { StoryObj } from '@storybook/angular';

import type { AlertComponent } from '@shot-there/components';

export const Dismissible: StoryObj<AlertComponent> = {
  render: () => {
    const shown = signal(true);
    return {
      props: { shown },
      template: `
        <div class="stack">
          @if (shown()) {
            <st-alert tone="success" role="status" title="Studio created as a draft" dismissible (dismissed)="shown.set(false)">
              Its address will be /studios/corktown-garage-studio.
            </st-alert>
          } @else {
            <button st-button size="sm" type="button" (click)="shown.set(true)">Show the alert again</button>
          }
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          '`dismissible` adds a Dismiss button that emits `dismissed`; the application removes the alert. Press Dismiss to try it.',
      },
    },
  },
};
