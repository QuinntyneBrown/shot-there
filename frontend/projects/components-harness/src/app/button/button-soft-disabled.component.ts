import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/** Image-manager row actions: the first row's "Move up" is soft-disabled, the second's is not. */
@Component({
  selector: 'st-button-soft-disabled',
  imports: [ButtonComponent, ActivationLogComponent],
  templateUrl: './button-soft-disabled.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonSoftDisabledComponent {
  protected readonly log = signal<readonly string[]>([]);

  protected record(entry: string): void {
    this.log.update((log) => [...log, entry]);
  }
}
