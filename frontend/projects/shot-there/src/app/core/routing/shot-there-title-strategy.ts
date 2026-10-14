import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { formatPageTitle } from './format-page-title';

/** Appends the site suffix to each route title: "Studios · ShotThere". */
@Injectable({ providedIn: 'root' })
export class ShotThereTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.title.setTitle(formatPageTitle(this.buildTitle(snapshot)));
  }
}
