import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, FilterTriggerComponent, IconButtonComponent, IconComponent, LinkComponent } from '@shot-there/components';

/** The studio list's chrome icons (menu, filters, four chip removers) and 27 cards' external and plus glyphs: 60 icons. */
@Component({
  selector: 'st-icon-performance',
  imports: [ButtonComponent, FilterTriggerComponent, IconButtonComponent, IconComponent, LinkComponent],
  templateUrl: './icon-performance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPerformanceComponent {
  protected readonly chips = ['Cyc wall', 'Natural light', 'Freight elevator', 'Under $100'];
  protected readonly cards = Array.from({ length: 27 }, (_, i) => `Studio ${i + 1}`);
}
