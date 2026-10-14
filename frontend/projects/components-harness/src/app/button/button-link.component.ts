import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, IconComponent } from '@shot-there/components';

/** a[st-button]: an external primary link with a trailing arrow, and an internal secondary one. */
@Component({
  selector: 'st-button-link',
  imports: [ButtonComponent, IconComponent],
  templateUrl: './button-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonLinkComponent {}
