import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, SheetComponent } from '@shot-there/components';

/** A sheet content component: filters with a footer button. */
@Component({
  selector: 'st-filters-sheet',
  imports: [SheetComponent, ButtonComponent],
  templateUrl: './filters-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersSheetComponent {}
