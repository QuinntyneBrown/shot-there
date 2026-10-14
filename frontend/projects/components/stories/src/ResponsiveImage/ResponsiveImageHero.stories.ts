import type { StoryObj } from '@storybook/angular';

import type { ResponsiveImageComponent } from '@shot-there/components';

import { photo } from './ResponsiveImagePhotos';

export const Hero: StoryObj<ResponsiveImageComponent> = {
  render: () => ({
    props: {
      hero: photo(
        'The Junction Loft: two tall north windows over a brick wall, a white cyc in the right corner and a softbox on a stand.',
        3000,
        2000,
        '#a4573f',
      ),
    },
    template: `
      <div style="width: 60rem; max-width: 100%; aspect-ratio: 16 / 7; overflow: hidden; background: var(--color-bg-photo)">
        <st-responsive-image [image]="hero" sizes="(min-width: 80rem) 1280px, 100vw" priority />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The review hero is the page\'s one `priority` image: it loads eagerly with `fetchpriority="high"` and is cropped to its 16:7 slot.',
      },
    },
  },
};
