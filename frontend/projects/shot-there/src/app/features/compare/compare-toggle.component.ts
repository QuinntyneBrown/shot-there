import { Component, computed, inject, input } from '@angular/core';

import { ButtonComponent } from '@shot-there/components';

import { CompareSelectionService } from '../../core/compare/compare-selection.service';

/** "Compare" adds the studio to the selection; "Remove" takes it out. */
@Component({
  selector: 'st-compare-toggle',
  imports: [ButtonComponent],
  templateUrl: './compare-toggle.component.html',
  styleUrl: './compare-toggle.component.css',
})
export class CompareToggleComponent {
  private readonly selection = inject(CompareSelectionService);
  readonly slug = input.required<string>();
  readonly name = input.required<string>();

  protected readonly selected = computed(() => this.selection.has(this.slug()));

  toggle(): void {
    if (this.selected()) {
      this.selection.remove(this.slug());
      return;
    }
    this.selection.add({ slug: this.slug(), name: this.name() });
  }
}
