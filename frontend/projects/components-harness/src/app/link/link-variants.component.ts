import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinkComponent } from '@shot-there/components';

/** a[st-link] inline in a sentence, standalone, external, and external with an application hint. */
@Component({
  selector: 'st-link-variants',
  imports: [LinkComponent],
  templateUrl: './link-variants.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkVariantsComponent {}
