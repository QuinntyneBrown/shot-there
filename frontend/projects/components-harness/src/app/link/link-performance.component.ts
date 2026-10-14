import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinkComponent } from '@shot-there/components';

/** A guide's ten entries, each with a standalone review link, and the review page's external links. */
@Component({
  selector: 'st-link-performance',
  imports: [LinkComponent],
  templateUrl: './link-performance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkPerformanceComponent {
  protected readonly studios = [
    'Kensington Window Room',
    'The Junction Loft',
    'Leslieville Daylight Studio',
    'Corktown Garage Studio',
    'Bloordale Sun Studio',
    'Liberty Village Cyc',
    'Ossington Blackbox',
    'Parkdale Brick Room',
    'Danforth Light House',
    'Roncesvalles North Room',
  ];
}
