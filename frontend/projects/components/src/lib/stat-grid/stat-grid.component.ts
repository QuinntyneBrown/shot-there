import { ChangeDetectionStrategy, Component } from '@angular/core';

/** The DS stat grid (.stat-grid): a one-column, then three-column list of stat tiles. */
@Component({
  selector: 'ul[st-stat-grid]',
  templateUrl: './stat-grid.component.html',
  styleUrl: './stat-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'stat-grid' },
})
export class StatGridComponent {}
