import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ButtonComponent,
  FilterTriggerComponent,
  IconButtonComponent,
  IconComponent,
} from '@shot-there/components';

/** Icons inside the controls that hold them on the studio list and a studio page. */
@Component({
  selector: 'st-icon-in-controls',
  imports: [ButtonComponent, FilterTriggerComponent, IconButtonComponent, IconComponent],
  templateUrl: './icon-in-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconInControlsComponent {
  protected readonly chips = ['Cyc wall', 'Natural light', 'Freight elevator', 'Under $100'];
}
