import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableComponent } from '@shot-there/components';

/** A stacking table with a caption, sortable header and numeric cells. */
@Component({
  selector: 'st-table-states',
  imports: [TableComponent],
  templateUrl: './table-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableStatesComponent {}
