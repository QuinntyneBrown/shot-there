import type { StoryObj } from '@storybook/angular';

import type { DescriptionListComponent } from '@shot-there/components';

export const Empty: StoryObj<DescriptionListComponent> = {
  render: () => ({
    props: { items: [] },
    template: `
      <section aria-labelledby="extras" class="stack stack--sm">
        <h2 id="extras">Costs extra</h2>
        <st-description-list [items]="items" />
        <p>Nothing costs extra at this studio.</p>
      </section>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'An empty `items` renders nothing; the application shows its own sentence instead.',
      },
    },
  },
};
