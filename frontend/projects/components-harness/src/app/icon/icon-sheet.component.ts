import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent, IconName } from '@shot-there/components';

/** st-icon once for every icon the DS sheet draws, each in a section named by the icon. */
@Component({
  selector: 'st-icon-sheet',
  imports: [IconComponent],
  templateUrl: './icon-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSheetComponent {
  protected readonly names: readonly IconName[] = [
    'close', 'menu', 'filters', 'search', 'chevron-left', 'chevron-right', 'plus', 'external',
    'play', 'refresh', 'success', 'info', 'warning', 'danger', 'camera', 'map-pin',
  ];
}
