import { signal } from '@angular/core';
import type { StoryObj } from '@storybook/angular';

import type { IconButtonComponent } from '@shot-there/components';

export const Outline: StoryObj<IconButtonComponent> = {
  render: () => {
    const photo = signal(1);
    const total = 8;
    return {
      props: {
        photo,
        total,
        step: (by: number) => photo.set(((photo() - 1 + by + total) % total) + 1),
      },
      template: `
        <div class="cluster">
          <button st-icon-button icon="close" label="Close" outline type="button"></button>
          <button st-icon-button icon="chevron-left" label="Previous photo" outline type="button" (click)="step(-1)"></button>
          <button st-icon-button icon="chevron-right" label="Next photo" outline type="button" (click)="step(1)"></button>
          <p role="status">Photo {{ photo() }} of {{ total }}</p>
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          '`outline` adds the hairline ring of the lightbox controls; the position lives in the lightbox’s status, not in the arrows’ names.',
      },
    },
  },
};
