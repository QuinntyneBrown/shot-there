import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkipLinkComponent } from '@shot-there/components';

/** A skip link before a main landmark. */
@Component({
  selector: 'st-skip-link-default',
  imports: [SkipLinkComponent],
  templateUrl: './skip-link-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkipLinkDefaultComponent {}
