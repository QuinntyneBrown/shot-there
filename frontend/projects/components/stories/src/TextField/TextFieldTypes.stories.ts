import type { StoryObj } from '@storybook/angular';

import type { TextFieldComponent } from '@shot-there/components';

export const Types: StoryObj<TextFieldComponent> = {
  render: () => ({
    template: `
      <div class="stack" style="max-width: 360px">
        <st-text-field
          label="Hourly rate"
          type="number"
          inputmode="decimal"
          min="0"
          step="0.01"
          prefix="$"
        />
        <st-text-field label="Password" type="password" size="lg" autocomplete="current-password" />
        <st-text-field label="Search by name or neighbourhood" type="search" [spellcheck]="false" />
        <st-text-field label="Prices last verified" type="date" max="2026-10-13" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`prefix` joins an addon such as `$`, `type="password"` adds a "Show" toggle and `type="search"` adds the search icon; other types are native.',
      },
    },
  },
};
