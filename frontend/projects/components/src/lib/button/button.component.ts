import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';
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
    '[class.btn--ghost-danger]': "variant() === 'ghost-danger'",
    '[class.btn--link]': "variant() === 'link'",
    '[class.btn--danger]': "variant() === 'danger'",
    '[class.btn--sm]': "size() === 'sm'",
    '[class.btn--lg]': "size() === 'lg'",
    '[class.btn--block]': 'block()',
    '[class.btn--icon]': 'iconOnly()',
    '[class.compare-toggle]': 'pressed() !== undefined',
    '[attr.aria-busy]': 'busy() || null',
    '[attr.aria-disabled]': 'busy() || softDisabled() || null',
    '[attr.aria-pressed]': 'pressed() ?? null',
  },
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('secondary');
  readonly size = input<ControlSize>('md');
  readonly block = input(false, { transform: booleanAttribute });
  /** Square and icon only; the consumer sets aria-label on the host. */
  readonly iconOnly = input(false, { transform: booleanAttribute });
  readonly busy = input(false, { transform: booleanAttribute });
  readonly softDisabled = input(false, { transform: booleanAttribute });
  /** When defined, the button is a toggle (.compare-toggle, aria-pressed); true shows the selected look (D-9). */
  readonly pressed = input<boolean | undefined>(undefined);

  constructor() {
    // A capture listener on the host runs before any consumer listener on it, so while busy or
    // soft-disabled no consumer sees the activation and a submit button submits nothing (ICD-FORM-8).
    inject(Renderer2).listen(
      inject(ElementRef).nativeElement,
      'click',
      (event: Event) => {
        if (this.busy() || this.softDisabled()) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      { capture: true },
    );
  }
}
