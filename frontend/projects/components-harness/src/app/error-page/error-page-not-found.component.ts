import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ErrorPageComponent, ButtonComponent } from '@shot-there/components';

/** A not-found page and a server error page with a reference. */
@Component({
  selector: 'st-error-page-not-found',
  imports: [ErrorPageComponent, ButtonComponent],
  templateUrl: './error-page-not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageNotFoundComponent {}
