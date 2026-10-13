import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '@shot-there/components';

/** The map pin at each IconSize, and once with no size. */
@Component({
  selector: 'st-icon-sizes',
  imports: [IconComponent],
  templateUrl: './icon-sizes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSizesComponent {}
