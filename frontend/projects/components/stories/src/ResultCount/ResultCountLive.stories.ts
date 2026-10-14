import { signal } from '@angular/core';
import type { StoryObj } from '@storybook/angular';

import type { ResultCountComponent } from '@shot-there/components';

export const Live: StoryObj<ResultCountComponent> = {
  render: () => {
    const text = signal('7 studios');
    return {
      props: {
        text,
        filter: () => {
          text.set('Loading studios…');
          setTimeout(() => text.set('2 studios'), 1000);
        },
        reset: () => text.set('7 studios'),
      },
      template: `
        <div class="stack">
          <st-result-count [text]="text()" />
          <div class="cluster">
            <button st-button type="button" (click)="filter()">Filter to Liberty Village</button>
            <button st-button variant="link" type="button" (click)="reset()">Clear all</button>
          </div>
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          'Changing `text` on the same element is announced politely: "Loading studios…", then "2 studios".',
      },
    },
  },
};
