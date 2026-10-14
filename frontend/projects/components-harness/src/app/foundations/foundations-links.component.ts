import { ChangeDetectionStrategy, Component } from '@angular/core';

/** A plain <a> in a sentence, styled only by the library's global stylesheet. */
@Component({
  selector: 'st-foundations-links',
  templateUrl: './foundations-links.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationsLinksComponent {}
