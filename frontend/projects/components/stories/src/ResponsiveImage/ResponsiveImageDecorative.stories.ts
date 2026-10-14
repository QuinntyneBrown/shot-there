import type { StoryObj } from '@storybook/angular';

import type { ResponsiveImageComponent } from '@shot-there/components';

import { photo } from './ResponsiveImagePhotos';

export const Decorative: StoryObj<ResponsiveImageComponent> = {
  render: () => ({
    props: {
      card: photo('Kensington Window Room: tall windows over a wooden floor', 1200, 800, '#c9b79c'),
    },
    template: `
      <div class="stack" style="width: 20rem; max-width: 100%">
        <div style="aspect-ratio: 3 / 2; overflow: hidden; border-radius: var(--radius-md); background: var(--color-bg-photo)">
          <st-responsive-image [image]="card" sizes="20rem" decorative />
        </div>
        <a href="#/studios/kensington-window-room">Kensington Window Room</a>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A card photo is `decorative` (`alt=""`) because the studio name that follows it says the same thing.',
      },
    },
  },
};
