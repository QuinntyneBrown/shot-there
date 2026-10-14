import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CheckboxComponent,
  CheckboxGroupComponent,
  RadioGroupComponent,
  SelectComponent,
  TextFieldComponent,
  type ChoiceOption,
  type SelectOption,
} from '@shot-there/components';

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
  imports: [
    CheckboxComponent,
    CheckboxGroupComponent,
    FormsModule,
    RadioGroupComponent,
    SelectComponent,
    TextFieldComponent,
  ],
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

  protected readonly standaloneNgModel = { standalone: true };
  protected readonly neighbourhoodOptions: readonly ChoiceOption[] = NEIGHBOURHOOD_OPTIONS.map(
    (neighbourhood) => ({ value: neighbourhood.slug, label: neighbourhood.label }),
  );
  protected readonly spaceOptions: readonly SelectOption[] = [
    { value: '', label: $localize`Any size` },
    ...MIN_SPACE_OPTIONS.map((space) => ({
      value: String(space),
      label: $localize`${space} m² or more`,
    })),
  ];
  protected readonly gearOptions: readonly { value: GearFilter; label: string }[] = [
    { value: 'lights', label: $localize`Lights` },
    { value: 'modifiers', label: $localize`Modifiers` },
    { value: 'stands', label: $localize`Stands` },
    { value: 'backdrops', label: $localize`Backdrops` },
  ];
  protected readonly parkingOptions: readonly ChoiceOption[] = [
    { value: '', label: $localize`Any` },
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

  setNeighbourhoods(selected: string[]): void {
    this.update({
      neighbourhoods: NEIGHBOURHOOD_OPTIONS.map((neighbourhood) => neighbourhood.slug).filter(
        (slug) => selected.includes(slug),
      ),
    });
  }

  setGear(selected: string[]): void {
    this.update({
      gear: this.gearOptions.map((gear) => gear.value).filter((gear) => selected.includes(gear)),
    });
  }

  setSpace(value: string): void {
    this.update({ minSpaceSqm: value === '' ? undefined : Number(value) });
  }

  setParking(value: string): void {
    this.update({ parking: value === '' ? undefined : (value as Parking) });
  }

  update(change: Partial<StudioListQuery>): void {
    this.queryChange.emit({ ...this.query(), ...change });
  }
}
