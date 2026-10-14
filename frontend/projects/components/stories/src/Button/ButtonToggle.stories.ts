import { signal } from '@angular/core';
import type { StoryObj } from '@storybook/angular';

import type { ButtonComponent } from '@shot-there/components';

export const Toggle: StoryObj<ButtonComponent> = {
  render: () => {
    const pressed = signal(true);
    return {
      props: { pressed },
      template: `
        <button st-button size="sm" type="button" [pressed]="pressed()" (click)="pressed.set(!pressed())">
          Compare<span class="visually-hidden"> Kensington Window Room</span>
        </button>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story: 'Binding `pressed` makes a toggle (`aria-pressed`); `true` shows the selected look.',
      },
    },
  },
};
