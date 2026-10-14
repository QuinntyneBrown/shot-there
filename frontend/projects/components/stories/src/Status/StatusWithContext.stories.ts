import type { StoryObj } from '@storybook/angular';

import type { StatusComponent } from '@shot-there/components';

export const WithContext: StoryObj<StatusComponent> = {
  render: () => ({
    template: `
      <div class="stack">
        <p><st-status status="draft">Draft</st-status> · Last saved 11 Oct 2026, 4:12 pm</p>
        <dl>
          <dt>Visibility</dt>
          <dd><st-status status="published">Published</st-status> · on the public site</dd>
        </dl>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'In the editor header and Status aside the application follows the label with what it means or when it was last saved.',
      },
    },
  },
};
