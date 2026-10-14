import type { StoryObj } from '@storybook/angular';

import type { SkipLinkComponent } from '@shot-there/components';

export const Default: StoryObj<SkipLinkComponent> = {
  args: {
    targetId: 'main',
    label: 'Skip to content',
  },
  render: (args) => ({
    props: args,
    template: `
      <st-skip-link [targetId]="targetId" [label]="label" />
      <main id="main" tabindex="-1" class="stack" style="padding-top: var(--space-16)">
        <h1>The Junction Loft</h1>
        <p>Press Tab to reveal the skip link, then Enter to move focus here.</p>
      </main>
    `,
  }),
  parameters: {
    docs: { story: { inline: false, height: '220px' } },
  },
};
