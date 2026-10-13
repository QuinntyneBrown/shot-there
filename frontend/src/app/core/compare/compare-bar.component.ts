import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';

import { APP_PATHS } from '../routing/app-paths';
import { COMPARE_LIMIT_TITLE, compareLimitHint } from './compare-limit-message';
import { CompareSelectionService } from './compare-selection.service';

const TOAST_MS = 6000;

/** Shown by the shell while any studio is selected; opens the comparison from 2 studios up. */
@Component({
  selector: 'st-compare-bar',
  templateUrl: './compare-bar.component.html',
  styleUrl: './compare-bar.component.css'
})
export class CompareBarComponent {
  private readonly router = inject(Router);
  protected readonly selection = inject(CompareSelectionService);
  protected readonly limitTitle = COMPARE_LIMIT_TITLE;
  protected readonly limitHint = compareLimitHint;

  constructor() {
    effect((onCleanup) => {
      if (this.selection.refused()) {
        const timer = setTimeout(() => this.selection.dismissRefusal(), TOAST_MS);
        onCleanup(() => clearTimeout(timer));
      }
    });
  }

  protected names(): string {
    return this.selection.items().map((item) => item.name).join(', ');
  }

  compare(): void {
    void this.router.navigate([`/${APP_PATHS.compare}`], {
      queryParams: { studios: this.selection.items().map((item) => item.slug).join(',') }
    });
  }
}
