import { signal } from '@angular/core';
import type { StoryObj } from '@storybook/angular';

import type { SpinnerComponent } from '@shot-there/components';

export const InStatus: StoryObj<SpinnerComponent> = {
  render: () => {
    const searching = signal(false);
    return {
      props: {
        searching,
        search: () => {
          searching.set(true);
          setTimeout(() => searching.set(false), 2000);
        },
      },
      template: `
        <div class="stack" style="max-width: 360px">
          <button type="button" (click)="search()">Search studios for "junction"</button>
          <p class="cluster" role="status">
            @if (searching()) {
              <st-spinner size="sm" label="Searching…" /><span aria-hidden="true">Searching</span>
            }
          </p>
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          'Inserted into a `role="status"` element that is already on the page, the label is announced once; the visible caption is `aria-hidden` so it is not read twice. Press the button to see two seconds of searching.',
      },
    },
  },
};
