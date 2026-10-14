import { Component, LOCALE_ID, computed, inject, input } from '@angular/core';
import { StudioPricingDto } from '@shot-there/api';
import { AlertComponent, PriceBlockComponent } from '@shot-there/components';

import { toStudioPricingView } from './studio-pricing.view-model';

@Component({
  selector: 'st-studio-pricing',
  imports: [PriceBlockComponent, AlertComponent],
  templateUrl: './studio-pricing.component.html',
})
export class StudioPricingComponent {
  private readonly locale = inject(LOCALE_ID);
  readonly pricing = input.required<StudioPricingDto>();
  protected readonly view = computed(() =>
    toStudioPricingView(this.pricing(), new Date(), this.locale),
  );
}
