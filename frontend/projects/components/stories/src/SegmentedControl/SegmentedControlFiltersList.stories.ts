import { computed, signal } from '@angular/core';
import type { StoryObj } from '@storybook/angular';

import type { SegmentedControlComponent, SegmentedOption } from '@shot-there/components';

const options: readonly SegmentedOption[] = [
  { value: 'both', label: 'Both' },
  { value: 'studios', label: 'Studios' },
  { value: 'spots', label: 'Spots' },
];

const locations = [
  { name: 'Kensington Window Room', type: 'studios' },
  { name: 'Liberty Village Loft', type: 'studios' },
  { name: 'Leslieville Daylight Studio', type: 'studios' },
  { name: 'Trinity Bellwoods', type: 'spots' },
  { name: 'Evergreen Brick Works', type: 'spots' },
];

export const FiltersList: StoryObj<SegmentedControlComponent> = {
  render: () => {
    const show = signal('both');
    const shown = computed(() =>
      locations.filter((location) => show() === 'both' || location.type === show()),
    );
    return {
      props: { options, show, shown },
      template: `
        <div class="stack">
          <st-segmented label="Show" [options]="options" [value]="show()" (valueChange)="show.set($event)" />
          <p role="status">{{ shown().length }} locations</p>
          <ul>
            @for (location of shown(); track location.name) {
              <li>{{ location.name }}</li>
            }
          </ul>
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          'The page reacts to `valueChange` and announces the result in its own status, not in the control.',
      },
    },
  },
};
