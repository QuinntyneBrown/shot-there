import type { StoryObj } from '@storybook/angular';

import type { SpinnerComponent } from '@shot-there/components';

export const Size: StoryObj<SpinnerComponent> = {
  render: () => ({
    template: `
      <div class="cluster">
        <st-spinner size="sm" label="Searching…" />
        <st-spinner label="Loading spots…" />
        <st-spinner size="lg" label="Loading studios…" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '`sm` is 16px, `md` (default) 20px and `lg` 40px.',
      },
    },
  },
};
