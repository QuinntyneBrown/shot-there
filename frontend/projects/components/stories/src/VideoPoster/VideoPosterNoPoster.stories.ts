import type { StoryObj } from '@storybook/angular';

import type { VideoPosterComponent } from '@shot-there/components';

import { episode } from './VideoPosterEpisode';

export const NoPoster: StoryObj<VideoPosterComponent> = {
  render: () => ({
    props: episode,
    template: `
      <div style="width: 20rem; max-width: 100%">
        <st-video-poster
          [watchUrl]="watchUrl"
          [embedUrl]="embedUrl"
          [title]="title"
          playLabel="Watch the episode"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'With no `poster` the 16:9 slot shows the inverse ground and the pill; here the application also overrides `playLabel`.',
      },
    },
  },
};
