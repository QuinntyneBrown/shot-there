import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DescriptionListComponent } from '../description-list/description-list.component';
import { DisplayDate } from '../types/display-date';
import { Fact } from '../types/fact';

/** The DS price block: the all-in figure and its explanation, the rate and fees, the verified date and a projected notice. */
@Component({
  selector: 'st-price-block',
  imports: [DescriptionListComponent],
  templateUrl: './price-block.component.html',
  styleUrl: './price-block.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'price-block' },
})
export class PriceBlockComponent {
  readonly allIn = input.required<string>();
  readonly allInText = input.required<string>();
  readonly items = input<readonly Fact[]>([]);
  readonly verifiedLabel = input.required<string>();
  readonly verified = input.required<DisplayDate>();
}
