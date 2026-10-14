import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DisclosureComponent, LinkComponent } from '@shot-there/components';

/** A disclosure with a statement and a policy link. */
@Component({
  selector: 'st-disclosure-default',
  imports: [DisclosureComponent, LinkComponent],
  templateUrl: './disclosure-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisclosureDefaultComponent {}
