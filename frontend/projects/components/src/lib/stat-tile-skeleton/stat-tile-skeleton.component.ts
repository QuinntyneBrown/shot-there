import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from '../skeleton/skeleton.component';

/** The loading placeholder for a stat tile: a title, a counts line and a button pill. Hidden from assistive technology. */
@Component({
  selector: 'li[st-stat-tile-skeleton]',
  imports: [SkeletonComponent],
  templateUrl: './stat-tile-skeleton.component.html',
  styleUrl: './stat-tile-skeleton.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'stat-tile stat-tile--skeleton', 'aria-hidden': 'true' },
})
export class StatTileSkeletonComponent {}
