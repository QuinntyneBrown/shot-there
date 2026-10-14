import { signal } from '@angular/core';
import type { StoryObj } from '@storybook/angular';

import type { ButtonComponent } from '@shot-there/components';

export const Busy: StoryObj<ButtonComponent> = {
  render: () => {
    const busy = signal(false);
    return {
      props: {
        busy,
        save: () => {
          busy.set(true);
          setTimeout(() => busy.set(false), 2000);
        },
      },
      template: `
        <button st-button variant="primary" type="button" [busy]="busy()" (click)="save()">
          Save changes
        </button>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          'While `busy` the button sets `aria-busy` and `aria-disabled` and swallows clicks, so a second press does nothing. Press it to see two seconds of busy.',
      },
    },
  },
};
