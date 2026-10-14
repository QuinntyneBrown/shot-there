import { Component, computed, input } from '@angular/core';
import { LoadIn, StudioLogisticsDto } from '@shot-there/api';

const LOAD_IN_LABELS: Record<LoadIn, string> = {
  stairs: $localize`Stairs`,
  elevator: $localize`Elevator`,
  freightElevator: $localize`Freight elevator`,
};

@Component({
  selector: 'st-studio-logistics',
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
}
