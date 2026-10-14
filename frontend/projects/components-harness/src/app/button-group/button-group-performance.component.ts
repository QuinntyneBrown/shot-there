import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { SegmentedControlComponent, SegmentedOption } from '@shot-there/components';

/** The map bar's "Show" over a list of 40 locations that the chosen type filters. */
@Component({
  selector: 'st-button-group-performance',
  imports: [SegmentedControlComponent],
  templateUrl: './button-group-performance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupPerformanceComponent {
  protected readonly options: readonly SegmentedOption[] = [
    { value: 'both', label: 'Both' },
    { value: 'studios', label: 'Studios' },
    { value: 'spots', label: 'Spots' },
  ];
  protected readonly show = signal('both');
  private readonly locations = Array.from({ length: 40 }, (_, i) => ({ name: `Location ${i + 1}`, type: i % 2 ? 'spots' : 'studios' }));
  protected readonly shown = computed(() => this.locations.filter((l) => this.show() === 'both' || l.type === this.show()));
}
