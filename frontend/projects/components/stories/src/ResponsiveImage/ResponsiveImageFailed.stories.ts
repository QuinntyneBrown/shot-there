import type { StoryObj } from '@storybook/angular';

import type { ResponsiveImageComponent } from '@shot-there/components';

import { brokenPhoto } from './ResponsiveImagePhotos';

export const Failed: StoryObj<ResponsiveImageComponent> = {
  render: () => ({
    props: {
      gallery: brokenPhoto(
        'Close portrait against the brick wall with the octabox as fill.',
        1600,
        2000,
      ),
      card: brokenPhoto('Kensington Window Room: tall windows over a wooden floor', 1200, 800),
    },
    template: `
      <div class="cluster" style="align-items: start">
        <div style="width: 15rem; aspect-ratio: 4 / 5; overflow: hidden; background: var(--color-bg-photo)">
          <st-responsive-image [image]="gallery" sizes="15rem" />
        </div>
        <div class="stack" style="width: 20rem; max-width: 100%">
          <div style="aspect-ratio: 3 / 2; overflow: hidden; border-radius: var(--radius-md)">
            <st-responsive-image [image]="card" sizes="20rem" decorative />
          </div>
          <a href="#/studios/kensington-window-room">Kensington Window Room</a>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A failed photo keeps its box and shows a `.media-fallback`: the icon and the alt text when informative, the icon only when decorative.',
      },
    },
  },
};
