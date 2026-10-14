import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SegmentedControlComponent, SegmentedOption } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/**
 * The map bar: its title, "Show" on "both" and "View as" on "map" (hidden from 62rem with .until-lg on
 * its host, as the map page does). The "Show studios only" checkbox sets "Show" from outside.
 */
@Component({
  selector: 'st-segmented-default',
  imports: [SegmentedControlComponent, ActivationLogComponent],
  templateUrl: './segmented-default.component.html',
  styleUrl: './segmented-default.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedDefaultComponent {
  protected readonly showOptions: readonly SegmentedOption[] = [
    { value: 'both', label: 'Both' },
    { value: 'studios', label: 'Studios' },
    { value: 'spots', label: 'Spots' },
  ];
  protected readonly viewOptions: readonly SegmentedOption[] = [
    { value: 'map', label: 'Map' },
    { value: 'list', label: 'List' },
  ];
  protected readonly show = signal('both');
  protected readonly view = signal('map');
  protected readonly log = signal<readonly string[]>([]);

  protected record(entry: string): void {
    this.log.update((log) => [...log, entry]);
  }
}
