import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudioSummary } from '@shot-there/api';

import { APP_PATHS } from '../../../core/routing/app-paths';
import { CompareToggleComponent } from '../../compare/compare-toggle.component';

@Component({
  selector: 'st-studio-card',
  imports: [RouterLink, CurrencyPipe, DatePipe, DecimalPipe, CompareToggleComponent],
  templateUrl: './studio-card.component.html',
  styleUrl: './studio-card.component.css',
})
export class StudioCardComponent {
  readonly studio = input.required<StudioSummary>();
  /** The first row of cards loads its photos straight away. */
  readonly eager = input(false);
  protected readonly studiosPath = `/${APP_PATHS.studios}`;
}
