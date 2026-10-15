import { Component, LOCALE_ID, computed, inject, input } from '@angular/core';
import { StudioSummary } from '@shot-there/api';
import { LocationCardComponent } from '@shot-there/components';

import { CompareToggleComponent } from '../../compare/compare-toggle.component';
import { toStudioCardViewModel } from './studio-card.view-model';

@Component({
  selector: 'app-studio-card',
  imports: [LocationCardComponent, CompareToggleComponent],
  templateUrl: './studio-card.component.html',
})
export class StudioCardComponent {
  private readonly locale = inject(LOCALE_ID);
  readonly studio = input.required<StudioSummary>();
  /** The first row of cards loads its photos straight away. */
  readonly eager = input(false);
  protected readonly viewModel = computed(() =>
    toStudioCardViewModel(this.studio(), this.locale),
  );
}
