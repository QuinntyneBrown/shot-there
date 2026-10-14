import type { StoryObj } from '@storybook/angular';

import type { ResponsiveImageComponent } from '@shot-there/components';

import { photo } from './ResponsiveImagePhotos';

export const Default: StoryObj<ResponsiveImageComponent & { alt: string }> = {
  args: {
    alt: 'Close portrait against the brick wall with the octabox as fill.',
    sizes: '15rem',
    priority: false,
    decorative: false,
  },
  render: (args) => ({
    props: { ...args, image: photo(args.alt, 1600, 2000) },
    template: `
      <div style="width: 15rem; aspect-ratio: 4 / 5; overflow: hidden; background: var(--color-bg-photo)">
        <st-responsive-image [image]="image" [sizes]="sizes" [priority]="priority" [decorative]="decorative" />
      </div>
    `,
  }),
};
