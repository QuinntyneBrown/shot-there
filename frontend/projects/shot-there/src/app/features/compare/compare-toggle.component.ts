import { Component, computed, inject, input } from '@angular/core';

import { AnnouncerService } from '../../core/a11y/announcer.service';
import { COMPARE_LIMIT_TITLE, compareLimitHint } from '../../core/compare/compare-limit-message';
import { CompareSelectionService } from '../../core/compare/compare-selection.service';

/** "Compare" adds the studio to the selection; "Remove" takes it out. */
@Component({
  selector: 'st-compare-toggle',
  templateUrl: './compare-toggle.component.html',
  styleUrl: './compare-toggle.component.css'
})
export class CompareToggleComponent {
  private readonly selection = inject(CompareSelectionService);
  private readonly announcer = inject(AnnouncerService);
  readonly slug = input.required<string>();
  readonly name = input.required<string>();

  protected readonly selected = computed(() => this.selection.has(this.slug()));

  toggle(): void {
    if (this.selected()) {
      this.selection.remove(this.slug());
      return;
    }
    if (this.selection.add({ slug: this.slug(), name: this.name() }) === 'limit-reached') {
      this.announcer.announcePolite(`${COMPARE_LIMIT_TITLE}. ${compareLimitHint(this.name())}`);
    }
  }
}
