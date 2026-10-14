import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LocationCardComponent, LocationCardSkeletonComponent, LocationGridComponent, TagListComponent, ButtonComponent } from '@shot-there/components';

/** A location grid with a card, a ranked card with facts and a stale badge, and a skeleton. */
@Component({
  selector: 'st-location-card-states',
  imports: [LocationCardComponent, LocationCardSkeletonComponent, LocationGridComponent, TagListComponent, ButtonComponent],
  templateUrl: './location-card-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationCardStatesComponent {
  private readonly image = {
    alt: 'Close portrait against the brick wall.',
    width: 1600,
    height: 2000,
    sources: [{ format: 'webp', srcset: '/test-images/9f2c41/480.webp 480w, /test-images/9f2c41/960.webp 960w' }, { format: 'jpeg', srcset: '/test-images/9f2c41/480.jpeg 480w, /test-images/9f2c41/960.jpeg 960w' }],
    fallbackUrl: '/test-images/9f2c41/960.jpeg',
  };
  protected readonly photo = this.image;
  protected readonly facts = [{ term: 'All-in', detail: '$145.00', badge: 'Prices may be out of date' }, { term: 'Score', detail: '3.8', srSuffix: ' out of 5' }];
  protected readonly tags = [{ label: 'Portrait' }];
}
