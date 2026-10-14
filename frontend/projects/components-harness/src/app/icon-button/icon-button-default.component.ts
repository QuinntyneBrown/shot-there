import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IconButtonComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/**
 * The map popup's ghost Close on a raised surface, the lightbox's outline Close, Previous and Next on
 * the canvas, a current icon link, and a disabled icon button.
 */
@Component({
  selector: 'st-icon-button-default',
  imports: [IconButtonComponent, ActivationLogComponent],
  templateUrl: './icon-button-default.component.html',
  styleUrl: './icon-button-default.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonDefaultComponent {
  protected readonly log = signal<readonly string[]>([]);

  protected record(entry: string): void {
    this.log.update((log) => [...log, entry]);
  }
}
