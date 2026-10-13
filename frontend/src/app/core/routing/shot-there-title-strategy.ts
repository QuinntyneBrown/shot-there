import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { PAGE_TITLES } from './page-titles';

/** Appends the site suffix to each route title: "Studios · ShotThere". */
@Injectable({ providedIn: 'root' })
export class ShotThereTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    this.title.setTitle(pageTitle ? `${pageTitle} · ${PAGE_TITLES.suffix}` : PAGE_TITLES.suffix);
  }
}
