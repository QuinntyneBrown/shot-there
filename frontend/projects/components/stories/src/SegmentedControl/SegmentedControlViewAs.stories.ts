import { signal } from '@angular/core';
import type { StoryObj } from '@storybook/angular';

import type { SegmentedControlComponent, SegmentedOption } from '@shot-there/components';

const options: readonly SegmentedOption[] = [
  { value: 'map', label: 'Map' },
  { value: 'list', label: 'List' },
];

export const ViewAs: StoryObj<SegmentedControlComponent> = {
  render: () => {
    const view = signal('map');
    return {
      props: { options, view },
      template: `<st-segmented label="View as" [options]="options" [value]="view()" (valueChange)="view.set($event)" />`,
    };
  },
  globals: { viewport: { value: 'xs', isRotated: false } },
  parameters: {
    docs: {
      description: {
        story: 'The map page’s phone "View as" control swaps the map and the list below 62rem.',
      },
    },
  },
};
