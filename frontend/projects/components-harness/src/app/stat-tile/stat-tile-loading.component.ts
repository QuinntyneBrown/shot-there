import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StatGridComponent, StatTileSkeletonComponent } from '@shot-there/components';

/** Three stat tile skeletons while the dashboard loads. */
@Component({
  selector: 'st-stat-tile-loading',
  imports: [StatGridComponent, StatTileSkeletonComponent],
  templateUrl: './stat-tile-loading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatTileLoadingComponent {}
