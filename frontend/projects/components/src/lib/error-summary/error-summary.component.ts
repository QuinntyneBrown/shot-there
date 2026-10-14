import { afterNextRender, ChangeDetectionStrategy, Component, effect, ElementRef, inject, Injector, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { _IdGenerator } from '@angular/cdk/a11y';
import { ErrorSummaryItem } from '../types/error-summary-item';
import { HeadingLevel } from '../types/heading-level';

/** The DS form error summary: takes focus when errors first appear, and each item moves focus to its field. */
@Component({
  selector: 'st-error-summary',
  templateUrl: './error-summary.component.html',
  styleUrl: './error-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.form-summary]': 'items().length > 0',
    '[attr.role]': "items().length > 0 ? 'alert' : null",
    '[attr.tabindex]': 'items().length > 0 ? -1 : null',
    '[attr.aria-labelledby]': 'items().length > 0 ? titleId : null',
    '[attr.title]': 'null',
  },
})
export class ErrorSummaryComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private hadItems = false;

  readonly title = input.required<string>();
  readonly items = input.required<readonly ErrorSummaryItem[]>();
  readonly headingLevel = input<HeadingLevel>(2);

  protected readonly titleId = inject(_IdGenerator).getId('st-summary-') + '-title';

  constructor() {
    effect(() => {
      const has = this.items().length > 0;
      if (has && !this.hadItems) {
        afterNextRender(() => this.host.nativeElement.focus(), { injector: this.injector });
      }
      this.hadItems = has;
    });
  }

  protected goTo(event: Event, item: ErrorSummaryItem): void {
    const target = this.document.getElementById(item.targetId);
    if (target) {
      event.preventDefault();
      target.focus();
    }
  }
}
