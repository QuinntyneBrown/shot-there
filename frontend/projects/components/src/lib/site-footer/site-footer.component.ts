import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavLink } from '../types/nav-link';

/** The DS site footer: brand and tagline, footer links, a copy line and a signup slot. */
@Component({
  selector: 'st-site-footer',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'site-footer' },
})
export class SiteFooterComponent {
  readonly brand = input.required<string>();
  readonly tagline = input<string | null>(null);
  readonly links = input.required<readonly NavLink[]>();
  readonly navLabel = input.required<string>();
  readonly copy = input<string | null>(null);
  readonly externalHint = input($localize`:@@st.link.external:(opens in a new tab)`);
}
