import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { StudioPricingDto } from '@shot-there/api';

import { toStudioPricingView } from './studio-pricing.view-model';

@Component({
  selector: 'st-studio-pricing',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './studio-pricing.component.html',
  styleUrl: './studio-pricing.component.css',
})
export class StudioPricingComponent {
  readonly pricing = input.required<StudioPricingDto>();
  protected readonly view = computed(() => toStudioPricingView(this.pricing(), new Date()));
}
