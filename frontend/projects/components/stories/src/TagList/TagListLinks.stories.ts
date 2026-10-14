import type { StoryObj } from '@storybook/angular';

import type { TagListComponent } from '@shot-there/components';

export const Links: StoryObj<TagListComponent> = {
  render: () => ({
    props: {
      guides: [
        { label: 'Best studios under $120 for 2 hours', link: '/guides/best-studios-under-120' },
        { label: 'Best natural light', link: '/guides/best-natural-light' },
      ],
    },
    template: `
      <section class="stack stack--sm" aria-labelledby="featured">
        <h2 id="featured">Featured in</h2>
        <st-tag-list [items]="guides" />
      </section>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Items with a `link` render as large `routerLink` tags; the visible heading names the list, so `label` is left unset.',
      },
    },
  },
};
