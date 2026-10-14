import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ErrorPageComponent, ButtonComponent } from '@shot-there/components';

/** A server error page with a reference and a paragraph with a link. */
@Component({
  selector: 'st-error-page-server-error',
  imports: [ErrorPageComponent, ButtonComponent],
  templateUrl: './error-page-server-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageServerErrorComponent {}
