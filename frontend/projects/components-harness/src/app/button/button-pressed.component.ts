import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent, IconComponent } from '@shot-there/components';

/**
 * Compare toggles that flip pressed and their label as the application does: a card's small toggle,
 * and the studio page's summary panel with "Book on the studio's site" above "Add to compare".
 */
@Component({
  selector: 'st-button-pressed',
  imports: [ButtonComponent, IconComponent],
  templateUrl: './button-pressed.component.html',
  styleUrl: './button-pressed.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPressedComponent {
  protected readonly carded = signal(false);
  protected readonly selected = signal(false);
}
