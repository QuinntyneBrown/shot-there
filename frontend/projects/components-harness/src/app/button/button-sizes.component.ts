import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, IconComponent } from '@shot-there/components';

/** One button[st-button] per ControlSize (medium has no size set), and an icon-only Close. */
@Component({
  selector: 'st-button-sizes',
  imports: [ButtonComponent, IconComponent],
  templateUrl: './button-sizes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonSizesComponent {}
