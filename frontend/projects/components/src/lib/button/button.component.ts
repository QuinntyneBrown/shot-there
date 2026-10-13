import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonVariant } from '../types/button-variant';
import { ControlSize } from '../types/control-size';

/**
 * The DS button (.btn) on a native button or link, so type, disabled, href and routerLink stay the
 * consumer's. The default slot is the accessible name, with an optional st-icon before or after.
 */
@Component({
  selector: 'button[st-button], a[st-button]',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'btn',
    '[class.btn--primary]': "variant() === 'primary'",
    '[class.btn--ghost]': "variant() === 'ghost'",
    '[class.btn--link]': "variant() === 'link'",
    '[class.btn--danger]': "variant() === 'danger'",
    '[class.btn--sm]': "size() === 'sm'",
    '[class.btn--lg]': "size() === 'lg'",
    '[class.btn--block]': 'block()',
  },
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('secondary');
  readonly size = input<ControlSize>('md');
  readonly block = input(false, { transform: booleanAttribute });
}
