import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgressComponent } from '@shot-there/components';

/** Progress bars: 45 %, 0 %, 100 %, indeterminate, out of range, and each tone. */
@Component({
  selector: 'st-progress-states',
  imports: [ProgressComponent],
  templateUrl: './progress-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressStatesComponent {}
