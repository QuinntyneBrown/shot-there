import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FilterTriggerComponent } from '@shot-there/components';

/**
 * The studios results head and filter options: ticking an option updates the trigger's count and the
 * count line. The result count and the option controls are stand-ins until their components land.
 */
@Component({
  selector: 'st-filter-performance',
  imports: [FilterTriggerComponent],
  templateUrl: './filter-performance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPerformanceComponent {
  protected readonly options = [
    'Natural light',
    'Cyc wall',
    'Freight elevator',
    'Blackout',
    'Kitchen',
    'Wi-Fi',
  ];
  protected readonly chosen = signal<readonly string[]>([]);
  protected readonly countLine = computed(() => `${7 - this.chosen().length * 2} studios`);

  protected toggle(option: string): void {
    this.chosen.update((c) =>
      c.includes(option) ? c.filter((o) => o !== option) : [...c, option],
    );
  }
}
