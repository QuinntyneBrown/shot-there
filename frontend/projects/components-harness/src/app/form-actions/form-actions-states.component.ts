import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormActionsComponent, SaveStatusComponent, ButtonComponent } from '@shot-there/components';

/** Sticky form actions with a save status in each state. */
@Component({
  selector: 'st-form-actions-states',
  imports: [FormActionsComponent, SaveStatusComponent, ButtonComponent],
  templateUrl: './form-actions-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormActionsStatesComponent {}
