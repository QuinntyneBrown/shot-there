import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SegmentedControlComponent, SegmentedOption } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/** The map's "Show" control on "both"; the "Show spots only" checkbox sets the value from outside. */
@Component({
  selector: 'st-segmented-default',
  imports: [SegmentedControlComponent, ActivationLogComponent],
  templateUrl: './segmented-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedDefaultComponent {
  protected readonly options: readonly SegmentedOption[] = [
    { value: 'both', label: 'Both' },
    { value: 'studios', label: 'Studios' },
    { value: 'spots', label: 'Spots' },
  ];
  protected readonly value = signal('both');
  protected readonly log = signal<readonly string[]>([]);

  protected changed(value: string): void {
    this.value.set(value);
    this.log.update((log) => [...log, `valueChange: ${value}`]);
  }
}
