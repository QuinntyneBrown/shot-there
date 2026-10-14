import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Where the guide's "Read the full review of Leslieville Daylight Studio" leads in the harness. */
@Component({
  selector: 'st-link-destination',
  templateUrl: './link-destination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkDestinationComponent {}
