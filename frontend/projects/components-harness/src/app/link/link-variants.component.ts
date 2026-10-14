import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinkComponent } from '@shot-there/components';

/**
 * a[st-link] as the mocks use it: inline in a sentence, standalone ("Change studios", a guide's
 * "Read the full review" links), and external (video, directions, a wrapping permit source, and one
 * with an application externalHint).
 */
@Component({
  selector: 'st-link-variants',
  imports: [LinkComponent],
  templateUrl: './link-variants.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkVariantsComponent {}
