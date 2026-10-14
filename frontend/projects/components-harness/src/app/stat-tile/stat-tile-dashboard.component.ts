import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  StatGridComponent,
  StatTileComponent,
  ButtonComponent,
  IconComponent,
} from '@shot-there/components';

/** Three dashboard tiles: first with a link title and a primary action, one without a link. */
@Component({
  selector: 'st-stat-tile-dashboard',
  imports: [StatGridComponent, StatTileComponent, ButtonComponent, IconComponent],
  templateUrl: './stat-tile-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatTileDashboardComponent {}
