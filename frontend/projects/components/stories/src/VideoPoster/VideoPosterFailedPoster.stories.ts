import type { StoryObj } from '@storybook/angular';

import type { VideoPosterComponent } from '@shot-there/components';

import { brokenPhoto } from '../ResponsiveImage/ResponsiveImagePhotos';
import { episode } from './VideoPosterEpisode';

export const FailedPoster: StoryObj<VideoPosterComponent> = {
  render: () => ({
    props: {
      ...episode,
      poster: brokenPhoto('The Junction Loft from the doorway', 1280, 720),
    },
    template: `
      <div style="width: 20rem; max-width: 100%">
        <st-video-poster
          [poster]="poster"
          [watchUrl]="watchUrl"
          [embedUrl]="embedUrl"
          [title]="title"
          [playContext]="playContext"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'When the still fails, its `.media-fallback` sits on the inverse ground and the Play pill moves to the bottom; the link still works.',
      },
    },
  },
};
