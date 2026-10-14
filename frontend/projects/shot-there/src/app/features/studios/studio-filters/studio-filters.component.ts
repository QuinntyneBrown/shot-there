import { Component, input, output } from '@angular/core';

import { GearFilter } from '../studio-list-page/gear-filter';
import { Parking } from '../studio-list-page/parking';
import {
  MIN_SPACE_OPTIONS,
  NEIGHBOURHOOD_OPTIONS,
} from '../studio-list-page/studio-filter-options';
import { StudioListQuery } from '../studio-list-page/studio-list-query';

/** The studio filter controls. Controlled: it shows `query` and emits every change as a new query. */
@Component({
  selector: 'st-studio-filters',
  templateUrl: './studio-filters.component.html',
  styleUrl: './studio-filters.component.css',
})
export class StudioFiltersComponent {
  readonly query = input.required<StudioListQuery>();
  /** Keeps ids unique when the sidebar and the dialog are both in the page. */
  readonly idPrefix = input.required<string>();
  /** A message about the cost range, shown under Maximum. */
  readonly costError = input<string | null>(null);
  readonly queryChange = output<StudioListQuery>();

  protected readonly neighbourhoods = NEIGHBOURHOOD_OPTIONS;
  protected readonly spaces = MIN_SPACE_OPTIONS;
  protected readonly gearOptions: readonly { value: GearFilter; label: string }[] = [
    { value: 'lights', label: $localize`Lights` },
    { value: 'modifiers', label: $localize`Modifiers` },
    { value: 'stands', label: $localize`Stands` },
    { value: 'backdrops', label: $localize`Backdrops` },
  ];
  protected readonly parkingOptions: readonly { value: Parking | undefined; label: string }[] = [
    { value: undefined, label: $localize`Any` },
    { value: 'on-site', label: $localize`On-site` },
    { value: 'street', label: $localize`Street` },
    { value: 'none', label: $localize`None` },
  ];

  setCost(field: 'costMin' | 'costMax', value: string): void {
    const cost = value.trim() === '' ? undefined : Number(value);
    this.update({
      [field]: cost !== undefined && Number.isFinite(cost) && cost >= 0 ? cost : undefined,
    });
  }

  toggleNeighbourhood(slug: string, checked: boolean): void {
    const selected = new Set(this.query().neighbourhoods);
    if (checked) {
      selected.add(slug);
    } else {
      selected.delete(slug);
    }
    this.update({
      neighbourhoods: this.neighbourhoods.map((n) => n.slug).filter((s) => selected.has(s)),
    });
  }

  toggleGear(gear: GearFilter, checked: boolean): void {
    const selected = new Set(this.query().gear);
    if (checked) {
      selected.add(gear);
    } else {
      selected.delete(gear);
    }
    this.update({ gear: this.gearOptions.map((g) => g.value).filter((g) => selected.has(g)) });
  }

  setSpace(value: string): void {
    this.update({ minSpaceSqm: value === '' ? undefined : Number(value) });
  }

  update(change: Partial<StudioListQuery>): void {
    this.queryChange.emit({ ...this.query(), ...change });
  }
}
