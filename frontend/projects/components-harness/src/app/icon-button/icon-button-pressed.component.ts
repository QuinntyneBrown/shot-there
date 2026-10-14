import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IconButtonComponent } from '@shot-there/components';

/** An icon toggle whose pressed state the harness flips on activation. */
@Component({
  selector: 'st-icon-button-pressed',
  imports: [IconButtonComponent],
  templateUrl: './icon-button-pressed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonPressedComponent {
  protected readonly pressed = signal(false);
}
