import { Component, computed, input } from '@angular/core';
import { LoadIn, StudioLogisticsDto } from '@shot-there/api';
import { DescriptionListComponent } from '@shot-there/components';

const LOAD_IN_LABELS: Record<LoadIn, string> = {
  stairs: $localize`Stairs`,
  elevator: $localize`Elevator`,
  freightElevator: $localize`Freight elevator`,
};

@Component({
  selector: 'app-studio-logistics',
  imports: [DescriptionListComponent],
  templateUrl: './studio-logistics.component.html',
  styleUrl: './studio-logistics.component.css',
})
export class StudioLogisticsComponent {
  readonly logistics = input.required<StudioLogisticsDto>();
  /** "Freight elevator · small, 1.2 m wide". */
  protected readonly loadIn = computed(() => {
    const { loadIn, loadInNote } = this.logistics();
    return loadInNote ? `${LOAD_IN_LABELS[loadIn]} · ${loadInNote}` : LOAD_IN_LABELS[loadIn];
  });

  protected readonly items = computed(() => {
    const l = this.logistics();
    return [
      { term: $localize`Load-in`, detail: this.loadIn() },
      { term: $localize`Parking`, detail: l.parking },
      { term: $localize`Transit`, detail: l.transit },
      { term: $localize`Washroom`, detail: l.washroom },
      { term: $localize`Changing area`, detail: l.changingArea || $localize`None` },
      { term: $localize`Client seating`, detail: l.clientSeating },
      { term: $localize`Noise`, detail: l.noise },
    ];
  });
}
