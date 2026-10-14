import type { StoryObj } from '@storybook/angular';

import type { SectionLinksComponent } from '@shot-there/components';

export const NoMeta: StoryObj<SectionLinksComponent> = {
  render: () => ({
    props: {
      items: [
        { label: 'Studios', link: '/studios' },
        { label: 'Spots', link: '/spots' },
        { label: 'Editorial policy', link: '/editorial-policy' },
      ],
    },
    template: `
      <div style="max-width: 360px">
        <st-section-links navLabel="Primary" [items]="items" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Without `meta` a row holds only its title and stays 72px tall.',
      },
    },
  },
};
