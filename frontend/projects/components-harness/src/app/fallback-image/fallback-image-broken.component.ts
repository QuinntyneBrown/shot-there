import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FallbackImageDirective } from '@shot-there/components';

/** img[stFallbackImage] whose source fails, informative and decorative, each in a 320px slot. */
@Component({
  selector: 'st-fallback-image-broken',
  imports: [FallbackImageDirective],
  templateUrl: './fallback-image-broken.component.html',
  styleUrl: './fallback-image-broken.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FallbackImageBrokenComponent {}
