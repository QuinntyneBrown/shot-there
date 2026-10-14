import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/** One button[st-button] per ButtonVariant (secondary has no variant set); the primary submits its form. */
@Component({
  selector: 'st-button-variants',
  imports: [ButtonComponent, ActivationLogComponent],
  templateUrl: './button-variants.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonVariantsComponent {
  protected readonly log = signal<readonly string[]>([]);

  protected record(entry: string, event?: Event): void {
    event?.preventDefault();
    this.log.update((log) => [...log, entry]);
  }
}
