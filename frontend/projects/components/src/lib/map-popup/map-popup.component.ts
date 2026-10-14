import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { _IdGenerator } from '@angular/cdk/a11y';
import { inject } from '@angular/core';
import { booleanAttribute } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { HeadingLevel } from '../types/heading-level';

/** The DS map popup: a card for one marker with its kind, name, a fact and a link; closes with its button or Escape. */
@Component({
  selector: 'st-map-popup',
  imports: [RouterLink, IconButtonComponent],
  templateUrl: './map-popup.component.html',
  styleUrl: './map-popup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'popover map-popup',
    '[class.map-popup--dock]': 'dock()',
    role: 'dialog',
    '[attr.aria-labelledby]': 'nameId',
    '[attr.title]': 'null',
    '(keydown.escape)': 'closed.emit()',
  },
})
export class MapPopupComponent {
  readonly kind = input.required<string>();
  readonly name = input.required<string>();
  readonly fact = input<string | null>(null);
  readonly link = input.required<string>();
  readonly linkText = input.required<string>();
  readonly headingLevel = input<HeadingLevel>(2);
  readonly dock = input(false, { transform: booleanAttribute });
  readonly closeLabel = input($localize`:@@st.dialog.close:Close`);
  readonly closed = output<void>();

  protected readonly nameId = inject(_IdGenerator).getId('st-map-popup-');
}
