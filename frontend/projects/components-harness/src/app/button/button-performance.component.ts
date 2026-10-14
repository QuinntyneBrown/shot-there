import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '@shot-there/components';

/** The studio list's seven card compare toggles and the compare bar's "Clear" and "Compare". */
@Component({
  selector: 'st-button-performance',
  imports: [ButtonComponent],
  templateUrl: './button-performance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPerformanceComponent {
  protected readonly studios = [
    'Kensington Window Room', 'The Junction Loft', 'Leslieville Daylight Studio', 'Corktown Garage Studio',
    'Bloordale Sun Studio', 'Liberty Village Cyc', 'Ossington Blackbox',
  ];
  protected readonly selected = signal<readonly string[]>([]);

  protected toggle(studio: string): void {
    this.selected.update((s) => (s.includes(studio) ? s.filter((x) => x !== studio) : [...s, studio]));
  }
}
