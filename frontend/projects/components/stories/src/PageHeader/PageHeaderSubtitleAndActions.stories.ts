import type { StoryObj } from '@storybook/angular';

import type { PageHeaderComponent } from '@shot-there/components';

export const SubtitleAndActions: StoryObj<PageHeaderComponent> = {
  render: () => ({
    template: `
      <div class="stack stack--lg">
        <st-page-header title="Studios">
          <span slot="subtitle">9 studios · 2 drafts</span>
          <a st-button slot="actions" variant="primary" href="#/admin/studios/new">New studio</a>
        </st-page-header>
        <st-page-header title="Kensington Window Room">
          <span slot="subtitle">Draft · Last saved 4:12 pm</span>
          <button st-button slot="actions" variant="ghost" type="button">Preview</button>
          <button st-button slot="actions" variant="primary" type="button">Publish</button>
        </st-page-header>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Project a muted line with `slot="subtitle"` and buttons or links with `slot="actions"`; narrow the viewport to see the actions wrap.',
      },
    },
  },
};
