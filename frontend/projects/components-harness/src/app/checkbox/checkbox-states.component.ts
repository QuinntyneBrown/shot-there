import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CheckboxComponent, CheckboxGroupComponent, RadioGroupComponent } from '@shot-there/components';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

/** A checkbox, a filter checkbox group, a form group with an error and a radio group. */
@Component({
  selector: 'st-checkbox-states',
  imports: [CheckboxComponent, CheckboxGroupComponent, RadioGroupComponent, ReactiveFormsModule],
  templateUrl: './checkbox-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxStatesComponent {
  protected readonly has20A = new FormControl(false, { nonNullable: true });
  protected readonly hoods = new FormControl<string[]>([], { nonNullable: true });
  protected readonly parking = new FormControl('', { nonNullable: true });
  protected readonly hoodOptions = [
    { value: 'bloordale', label: 'Bloordale' },
    { value: 'junction', label: 'Junction' },
    { value: 'leslieville', label: 'Leslieville' },
  ];
  protected readonly parkingOptions = [
    { value: '', label: 'Any' },
    { value: 'on-site', label: 'On-site' },
    { value: 'street', label: 'Street' },
  ];
}
