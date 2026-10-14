import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { PRIMARY_NAV_LINKS } from './primary-nav-links';
import { SiteMenuDialogComponent } from './site-menu-dialog.component';

@Component({
  selector: 'st-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly dialog = inject(Dialog);
  protected readonly links = PRIMARY_NAV_LINKS;
  protected readonly menuOpen = signal(false);

  openMenu(): void {
    this.menuOpen.set(true);
    const ref = this.dialog.open(SiteMenuDialogComponent, {
      ariaLabelledBy: 'site-menu-title',
      width: '100%',
      height: '100%',
      maxWidth: '100%',
    });
    ref.closed.subscribe(() => this.menuOpen.set(false));
  }
}
