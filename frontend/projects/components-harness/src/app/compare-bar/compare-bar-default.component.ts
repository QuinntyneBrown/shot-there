import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CompareBarComponent, ButtonComponent } from '@shot-there/components';

/** A compare bar with a count, hint, names and actions. */
@Component({
  selector: 'st-compare-bar-default',
  imports: [CompareBarComponent, ButtonComponent],
  templateUrl: './compare-bar-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompareBarDefaultComponent {}
