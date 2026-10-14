import type { StoryObj } from '@storybook/angular';

import type { LinkComponent } from '@shot-there/components';

export const Standalone: StoryObj<LinkComponent> = {
  render: () => ({
    template: `
      <ol class="stack">
        <li>
          <a st-link standalone href="#/studios/kensington-window-room"
            >Read the full review<span class="visually-hidden"> of Kensington Window Room</span></a
          >
        </li>
        <li>
          <a st-link standalone href="#/studios/liberty-village-loft"
            >Read the full review<span class="visually-hidden"> of Liberty Village Loft</span></a
          >
        </li>
        <li>
          <a st-link standalone href="#/studios/the-junction-loft"
            >Read the full review<span class="visually-hidden"> of The Junction Loft</span></a
          >
        </li>
      </ol>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`standalone` gives a 44px target on its own line; repeated labels carry their studio in hidden text.',
      },
    },
  },
};
