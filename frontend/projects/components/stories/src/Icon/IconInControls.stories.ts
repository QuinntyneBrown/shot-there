import type { StoryObj } from '@storybook/angular';

import type { IconComponent } from '@shot-there/components';

export const InControls: StoryObj<IconComponent> = {
  render: () => ({
    template: `
      <div class="stack">
        <div class="cluster">
          <button st-button type="button"><st-icon name="refresh" />Try again</button>
          <button st-filter-trigger type="button" aria-expanded="false" count="2">Filters</button>
          <button st-icon-button icon="close" label="Close" type="button"></button>
        </div>
        <div class="cluster">
          <a
            st-button
            variant="primary"
            href="https://kensingtonwindowroom.example/book"
            target="_blank"
            rel="noopener"
            >Book on the studio's site<st-icon name="external" /><span class="visually-hidden">
              (opens in a new tab)</span
            ></a
          >
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Inside a control the icon takes the control’s size and ink, and the control’s text or `aria-label` is the name.',
      },
    },
  },
};
