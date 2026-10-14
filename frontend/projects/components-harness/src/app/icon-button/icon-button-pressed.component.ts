import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconButtonComponent } from '@shot-there/components';

/** An icon toggle not pressed, one pressed, and an icon button that is not a toggle. */
@Component({
  selector: 'st-icon-button-pressed',
  imports: [IconButtonComponent],
  templateUrl: './icon-button-pressed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonPressedComponent {}
