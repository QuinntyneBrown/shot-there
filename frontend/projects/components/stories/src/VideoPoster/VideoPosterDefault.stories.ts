import type { StoryObj } from '@storybook/angular';

import type { VideoPosterComponent } from '@shot-there/components';

import { photo } from '../ResponsiveImage/ResponsiveImagePhotos';
import { episode } from './VideoPosterEpisode';

export const Default: StoryObj<VideoPosterComponent> = {
  args: {
    watchUrl: episode.watchUrl,
    title: episode.title,
    playLabel: 'Play episode',
    playContext: episode.playContext,
  },
  render: (args) => ({
    props: {
      ...args,
      embedUrl: episode.embedUrl,
      poster: photo('The Junction Loft from the doorway', 1280, 720, '#a4573f'),
    },
    template: `
      <div style="width: 20rem; max-width: 100%">
        <st-video-poster
          [poster]="poster"
          [watchUrl]="watchUrl"
          [embedUrl]="embedUrl"
          [title]="title"
          [playLabel]="playLabel"
          [playContext]="playContext"
        />
      </div>
    `,
  }),
};
