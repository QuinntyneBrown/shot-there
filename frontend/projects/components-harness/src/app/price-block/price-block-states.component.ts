import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PriceBlockComponent } from '@shot-there/components';

/** A price block with fees, a verified date and a projected stale notice. */
@Component({
  selector: 'st-price-block-states',
  imports: [PriceBlockComponent],
  templateUrl: './price-block-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceBlockStatesComponent {
  protected readonly items = [
    { term: 'Hourly rate', detail: '$60.00', numeric: true },
    { term: 'Minimum booking', detail: '2 hours' },
    { term: 'Cleaning fee', detail: '$25.00', numeric: true, badge: 'Mandatory' },
  ];
  protected readonly verified = { datetime: '2026-09-22', text: '22 September 2026' };
}
