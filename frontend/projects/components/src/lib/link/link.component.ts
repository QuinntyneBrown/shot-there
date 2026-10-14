import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/** The DS link on a native <a>: inline by default, standalone (44px), or external (new tab, arrow, hidden hint). */
@Component({
  selector: 'a[st-link]',
  imports: [IconComponent],
  templateUrl: './link.component.html',
  styleUrl: './link.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.link--standalone]': 'standalone()',
    '[class.link--external]': 'external()',
    '[attr.target]': "external() ? '_blank' : null",
    '[attr.rel]': "external() ? 'noopener' : null",
  },
})
export class LinkComponent {
  readonly standalone = input(false, { transform: booleanAttribute });
  readonly external = input(false, { transform: booleanAttribute });
  readonly externalHint = input($localize`:@@st.link.external:(opens in a new tab)`);
}
