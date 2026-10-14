import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteFooterComponent, SkipLinkComponent } from '@shot-there/components';
import type { NavLink } from '@shot-there/components';

import { CompareBarComponent } from '../compare/compare-bar.component';
import { EmailSignupComponent } from '../email-signup/email-signup.component';
import { APP_PATHS } from '../routing/app-paths';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'st-shell',
  imports: [
    RouterOutlet,
    SkipLinkComponent,
    HeaderComponent,
    SiteFooterComponent,
    EmailSignupComponent,
    CompareBarComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent {
  protected readonly footerBrand = $localize`ShotThere`;
  protected readonly footerTagline = $localize`Toronto photo studios and outdoor spots, reviewed first-hand. Nothing is listed unless it has been shot there.`;
  protected readonly footerNavLabel = $localize`Footer`;
  protected readonly footerCopy = $localize`© ${new Date().getFullYear()} ShotThere · No paid placement: order comes only from the sort you choose.`;
  protected readonly externalHint = $localize`:@@st.link.external:(opens in a new tab)`;
  protected readonly footerLinks: readonly NavLink[] = [
    { label: $localize`Studios`, link: `/${APP_PATHS.studios}` },
    { label: $localize`Spots`, link: `/${APP_PATHS.spots}` },
    { label: $localize`Guides`, link: `/${APP_PATHS.guides}` },
    { label: $localize`Editorial policy`, link: `/${APP_PATHS.editorialPolicy}` },
    {
      label: $localize`YouTube channel`,
      link: 'https://www.youtube.com/@ShotThere',
      external: true,
    },
  ];
}
