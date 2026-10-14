import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DescriptionListComponent } from '@shot-there/components';

/** Pricing facts: plain, numeric, numeric with a badge, and a hidden suffix; plus an empty list. */
@Component({
  selector: 'st-description-list-pricing',
  imports: [DescriptionListComponent],
  templateUrl: './description-list-pricing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionListPricingComponent {
  protected readonly items = [
    { term: 'Hourly rate', detail: '$60.00', numeric: true },
    { term: 'Minimum booking', detail: '2 hours' },
    { term: 'Cleaning fee', detail: '$25.00', numeric: true, badge: 'Mandatory' },
    { term: 'Light', detail: '5', srSuffix: ' out of 5' },
  ];
}
