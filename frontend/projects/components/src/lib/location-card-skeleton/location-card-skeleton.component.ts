import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from '../skeleton/skeleton.component';

/** The loading placeholder for a location card, matching its box so nothing shifts. Hidden from assistive technology. */
@Component({
  selector: 'st-location-card-skeleton',
  imports: [SkeletonComponent],
  templateUrl: './location-card-skeleton.component.html',
  styleUrl: './location-card-skeleton.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'location-card location-card--skeleton', 'aria-hidden': 'true' },
})
export class LocationCardSkeletonComponent {}
