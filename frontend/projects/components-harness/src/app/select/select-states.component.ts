import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SelectComponent } from '@shot-there/components';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

/** A form select and an inline sort select. */
@Component({
  selector: 'st-select-states',
  imports: [SelectComponent, ReactiveFormsModule],
  templateUrl: './select-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectStatesComponent {
  protected readonly sort = new FormControl('recent', { nonNullable: true });
  protected readonly options = [
    { value: 'recent', label: 'Most recent review' },
    { value: 'cost', label: 'All-in cost, low to high' },
    { value: 'score', label: 'Overall score, high to low' },
  ];
}
