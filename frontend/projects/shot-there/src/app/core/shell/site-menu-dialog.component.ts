import { Component } from '@angular/core';
import { SectionLinksComponent, SheetComponent } from '@shot-there/components';

import { ABOUT_NAV_LINKS } from './about-nav-links';
import { PRIMARY_NAV_LINKS } from './primary-nav-links';

@Component({
  selector: 'app-site-menu-dialog',
  imports: [SheetComponent, SectionLinksComponent],
  templateUrl: './site-menu-dialog.component.html',
})
export class SiteMenuDialogComponent {
  protected readonly links = PRIMARY_NAV_LINKS.map(({ path, label, description }) => ({
    link: path,
    label,
    meta: description,
  }));
  protected readonly aboutLinks = ABOUT_NAV_LINKS.map(({ path, label, description }) => ({
    link: path,
    label,
    meta: description,
  }));
}
