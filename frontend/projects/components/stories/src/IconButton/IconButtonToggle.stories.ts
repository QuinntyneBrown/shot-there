import { signal } from '@angular/core';
import type { StoryObj } from '@storybook/angular';

import type { IconButtonComponent } from '@shot-there/components';

export const Toggle: StoryObj<IconButtonComponent> = {
  render: () => {
    const view = signal<'map' | 'list'>('list');
    return {
      props: { view },
      template: `
        <div class="cluster">
          <button st-icon-button icon="map-pin" label="Show the map" type="button" [pressed]="view() === 'map'" (click)="view.set('map')"></button>
          <button st-icon-button icon="list" label="Show the list" type="button" [pressed]="view() === 'list'" (click)="view.set('list')"></button>
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          'Binding `pressed` renders `aria-pressed`; `true` draws the subtle fill and accent ink.',
      },
    },
  },
};
