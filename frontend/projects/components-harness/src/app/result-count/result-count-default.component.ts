import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResultCountComponent } from '@shot-there/components';

/** A result count with a visually hidden sort suffix. */
@Component({
  selector: 'st-result-count-default',
  imports: [ResultCountComponent],
  templateUrl: './result-count-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultCountDefaultComponent {}
