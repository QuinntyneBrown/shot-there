import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/**
 * A primary submit button in a form. The "Busy" checkbox drives its busy input; so does the B key,
 * which leaves focus where it is.
 */
@Component({
  selector: 'st-button-busy',
  imports: [ButtonComponent, ActivationLogComponent],
  templateUrl: './button-busy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.b)': 'busy.set(!busy())' },
})
export class ButtonBusyComponent {
  protected readonly busy = signal(false);
  protected readonly log = signal<readonly string[]>([]);

  protected record(entry: string, event?: Event): void {
    event?.preventDefault();
    this.log.update((log) => [...log, entry]);
  }
}
