import type { StoryObj } from '@storybook/angular';

import type { ResponsiveImageComponent } from '@shot-there/components';

export const FallbackImage: StoryObj<ResponsiveImageComponent> = {
  render: () => ({
    template: `
      <div style="width: 20rem; max-width: 100%; aspect-ratio: 8 / 5">
        <img
          stFallbackImage
          src="/missing/junction-loft-cyc.jpg"
          alt="The Junction Loft, cyc wall from the doorway"
          width="320"
          height="200"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`img[stFallbackImage]` on a plain `<img>`: when the single URL fails, the image is hidden and a `.media-fallback` with its alt text fills the same slot.',
      },
    },
  },
};
