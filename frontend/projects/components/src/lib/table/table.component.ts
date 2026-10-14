import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The DS table on a native table: the application writes caption, thead, tbody and th scope. */
@Component({
  selector: 'table[st-table]',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'table', '[class.table--stack]': 'stack()', '[class.table--dense]': 'dense()' },
})
export class TableComponent {
  readonly stack = input(false, { transform: booleanAttribute });
  readonly dense = input(false, { transform: booleanAttribute });
}
