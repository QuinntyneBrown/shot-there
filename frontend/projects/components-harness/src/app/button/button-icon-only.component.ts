import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, IconComponent } from '@shot-there/components';

/** The dialog's icon-only ghost Close at medium and small size. */
@Component({
  selector: 'st-button-icon-only',
  imports: [ButtonComponent, IconComponent],
  templateUrl: './button-icon-only.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonIconOnlyComponent {}
