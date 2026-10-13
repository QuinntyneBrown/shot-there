import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FallbackImageDirective } from '@shot-there/components';

/** img[stFallbackImage] whose source fails, in a 320 x 200 slot. */
@Component({
  selector: 'st-fallback-image-broken',
  imports: [FallbackImageDirective],
  templateUrl: './fallback-image-broken.component.html',
  styleUrl: './fallback-image-broken.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FallbackImageBrokenComponent {}
