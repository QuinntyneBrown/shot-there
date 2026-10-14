import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  DialogService,
  SiteFooterComponent,
  SiteHeaderComponent,
  SkipLinkComponent,
} from '@shot-there/components';
import type { NavLink } from '@shot-there/components';

import { CompareBarComponent } from '../compare/compare-bar.component';
import { EmailSignupComponent } from '../email-signup/email-signup.component';
import { APP_PATHS } from '../routing/app-paths';
import { PRIMARY_NAV_LINKS } from './primary-nav-links';
import { SiteMenuDialogComponent } from './site-menu-dialog.component';

@Component({
  selector: 'st-shell',
  imports: [
    RouterOutlet,
    SkipLinkComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    EmailSignupComponent,
    CompareBarComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent {
  private readonly dialogService = inject(DialogService);
  protected readonly menuOpen = signal(false);
  protected readonly headerBrand = $localize`ShotThere`;
  protected readonly headerBrandTag = $localize`Toronto`;
  protected readonly headerHomeLink = `/${APP_PATHS.home}`;
  protected readonly headerNavLabel = $localize`Primary`;
  protected readonly headerLinks: readonly NavLink[] = PRIMARY_NAV_LINKS.map(({ path, label }) => ({
    label,
    link: path,
  }));
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

  protected openMenu(): void {
    this.menuOpen.set(true);
    const ref = this.dialogService.open(SiteMenuDialogComponent, {
      kind: 'sheet',
      ariaLabelledBy: 'site-menu-title',
    });
    ref.closed.subscribe(() => this.menuOpen.set(false));
  }
}
