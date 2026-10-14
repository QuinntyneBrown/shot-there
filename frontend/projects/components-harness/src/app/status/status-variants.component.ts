import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StatusComponent } from '@shot-there/components';


/** A published and a draft status label. */
@Component({
  selector: 'st-status-variants',
  imports: [StatusComponent],
  templateUrl: './status-variants.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusVariantsComponent {

}
