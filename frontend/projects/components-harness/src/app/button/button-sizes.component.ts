import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '@shot-there/components';

/** One button[st-button] per ControlSize; medium has no size set. */
@Component({
  selector: 'st-button-sizes',
  imports: [ButtonComponent],
  templateUrl: './button-sizes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonSizesComponent {}
