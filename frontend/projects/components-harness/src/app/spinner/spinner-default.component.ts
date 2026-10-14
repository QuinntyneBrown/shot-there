import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpinnerComponent } from '@shot-there/components';

/** A default spinner, a small one beside a caption in a status element, and a large one with its own label. */
@Component({
  selector: 'st-spinner-default',
  imports: [SpinnerComponent],
  templateUrl: './spinner-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerDefaultComponent {}
