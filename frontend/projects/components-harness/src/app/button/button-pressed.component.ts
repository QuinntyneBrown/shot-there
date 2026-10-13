import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '@shot-there/components';

/** A card's compare toggle, which flips pressed and its label as the application does, beside a plain button. */
@Component({
  selector: 'st-button-pressed',
  imports: [ButtonComponent],
  templateUrl: './button-pressed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPressedComponent {
  protected readonly selected = signal(false);
}
