import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent, IconName } from '@shot-there/components';

/** st-icon once for every IconName, each in a section named by the icon. */
@Component({
  selector: 'st-icon-sheet',
  imports: [IconComponent],
  templateUrl: './icon-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSheetComponent {
  protected readonly names: readonly IconName[] = [
    'search',
    'menu',
    'close',
    'chevron-left',
    'chevron-right',
    'chevron-down',
    'filters',
    'map-pin',
    'check',
    'mail',
    'lock',
    'sign-out',
    'home',
    'plus',
    'edit',
    'trash',
    'arrow-up',
    'arrow-down',
    'camera',
    'upload',
    'eye',
    'clock',
    'refresh',
    'offline',
    'info',
    'success',
    'warning',
    'danger',
    'external',
    'play',
    'copy',
    'image',
    'image-failed',
    'tree',
    'compare',
    'guide',
    'list',
  ];
}
