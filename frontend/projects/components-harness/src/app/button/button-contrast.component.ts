import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '@shot-there/components';

/** Primary, secondary, danger, link and a pressed toggle on the page, on a dialog surface and on a card. */
@Component({
  selector: 'st-button-contrast',
  imports: [ButtonComponent],
  templateUrl: './button-contrast.component.html',
  styleUrl: './button-contrast.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonContrastComponent {
  protected readonly grounds = ['page', 'dialog', 'card'];
}
