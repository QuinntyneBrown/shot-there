import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, Renderer2, signal } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter, takeUntil } from 'rxjs';

import {
  ButtonComponent,
  CompareBarComponent,
  DialogService,
  SiteFooterComponent,
  SiteHeaderComponent,
  SkipLinkComponent,
  ToastRegionComponent,
} from '@shot-there/components';
import type { NavLink } from '@shot-there/components';

import { CompareSelectionService } from '../compare/compare-selection.service';
import { EmailSignupComponent } from '../email-signup/email-signup.component';
import { APP_PATHS } from '../routing/app-paths';
import { PRIMARY_NAV_LINKS } from './primary-nav-links';
import { SiteMenuDialogComponent } from './site-menu-dialog.component';

@Component({
  selector: 'st-shell',
  imports: [
    RouterOutlet,
    ButtonComponent,
    CompareBarComponent,
    SkipLinkComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    EmailSignupComponent,
    ToastRegionComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent {
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  protected readonly selection = inject(CompareSelectionService);
  protected readonly menuOpen = signal(false);
  protected readonly compareBarLabel = $localize`Studios to compare`;
  protected readonly compareBarCountText = computed(
    () => $localize`${this.selection.count()} selected`,
  );
  protected readonly compareBarHint = computed(() =>
    this.selection.canCompare() ? null : $localize`Pick at least 2 studios to compare`,
  );
  protected readonly compareBarNames = computed(() =>
    this.selection.items().map((item) => item.name).join(', '),
  );
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

  constructor() {
    effect(() => {
      if (this.selection.count() > 0) {
        this.renderer.addClass(this.document.body, 'has-compare-bar');
      } else {
        this.renderer.removeClass(this.document.body, 'has-compare-bar');
      }
    });
  }

  protected compare(): void {
    void this.router.navigate([`/${APP_PATHS.compare}`], {
      queryParams: {
        studios: this.selection
          .items()
          .map((item) => item.slug)
          .join(','),
      },
    });
  }

  protected openMenu(): void {
    this.menuOpen.set(true);
    const ref = this.dialogService.open(SiteMenuDialogComponent, {
      kind: 'sheet',
    });
    ref.closed.subscribe(() => this.menuOpen.set(false));
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(ref.closed),
      )
      .subscribe(() => ref.close());
  }
}
