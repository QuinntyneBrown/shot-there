import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { IconComponent } from '../icon/icon.component';
import { NavLink } from '../types/nav-link';

/** The DS site header: wordmark, primary links, an actions slot and the menu button shown below MD. */
@Component({
  selector: 'st-site-header',
  imports: [RouterLink, RouterLinkActive, IconButtonComponent, IconComponent],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'site-header' },
})
export class SiteHeaderComponent {
  readonly brand = input.required<string>();
  readonly brandTag = input<string | null>(null);
  readonly homeLink = input.required<string>();
  readonly links = input.required<readonly NavLink[]>();
  readonly navLabel = input.required<string>();
  readonly menuLabel = input($localize`:@@st.siteHeader.menu:Menu`);
  readonly menuExpanded = input(false);
  readonly menuControls = input<string | null>(null);
  readonly externalHint = input($localize`:@@st.link.external:(opens in a new tab)`);
  readonly menuToggled = output<void>();
}
