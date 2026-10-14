import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../types/icon-name';

/** The DS icon button (.icon-btn): a lone glyph on a native button or link, named by `label`. */
@Component({
  selector: 'button[st-icon-button], a[st-icon-button]',
  imports: [IconComponent],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'icon-btn',
    '[class.icon-btn--outline]': 'outline()',
    '[attr.aria-label]': 'label()',
    '[attr.aria-pressed]': 'pressed() ?? null',
  },
})
export class IconButtonComponent {
  readonly icon = input.required<IconName>();
  readonly label = input.required<string>();
  readonly outline = input(false, { transform: booleanAttribute });
  readonly pressed = input<boolean | undefined>(undefined);
}
