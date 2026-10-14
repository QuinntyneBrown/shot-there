import { signal } from '@angular/core';
import type { StoryObj } from '@storybook/angular';

import type { ResponsiveImageComponent } from '@shot-there/components';

import { brokenPhoto, photo } from './ResponsiveImagePhotos';

const alt = 'Full-length fashion frame on the cyc, warm afternoon light from the left.';

export const Recovered: StoryObj<ResponsiveImageComponent> = {
  render: () => {
    const image = signal(brokenPhoto(alt, 1600, 2000));
    return {
      props: {
        image,
        retry: () => image.set(photo(alt, 1600, 2000, '#d8c3a5')),
      },
      template: `
        <div class="stack" style="width: 15rem">
          <div style="aspect-ratio: 4 / 5; overflow: hidden; background: var(--color-bg-photo)">
            <st-responsive-image [image]="image()" sizes="15rem" />
          </div>
          <button st-button type="button" (click)="retry()">Use a working photo</button>
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          'A new `image` value clears the failed state and renders the picture again. Press the button to pass a working photo.',
      },
    },
  },
};
