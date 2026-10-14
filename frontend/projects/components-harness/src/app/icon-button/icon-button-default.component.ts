import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IconButtonComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/** A ghost Close, an outline Next photo, and an icon link. */
@Component({
  selector: 'st-icon-button-default',
  imports: [IconButtonComponent, ActivationLogComponent],
  templateUrl: './icon-button-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonDefaultComponent {
  protected readonly log = signal<readonly string[]>([]);

  protected record(entry: string): void {
    this.log.update((log) => [...log, entry]);
  }
}
