import type { StoryObj } from '@storybook/angular';

import type { TagListComponent } from '@shot-there/components';

export const Empty: StoryObj<TagListComponent> = {
  render: () => ({
    props: { items: [] },
    template: `
      <div class="stack stack--sm">
        <st-tag-list label="Featured in" [items]="items" />
        <p>Bloordale Sun Studio is in no guide, so the tag list renders nothing.</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'With no `items` the component renders no list at all.',
      },
    },
  },
};
