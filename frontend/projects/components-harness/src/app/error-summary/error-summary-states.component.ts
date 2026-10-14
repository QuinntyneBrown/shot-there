import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ErrorSummaryComponent, TextFieldComponent } from '@shot-there/components';

/** An error summary that appears when the Fail button is pressed, with a field it links to. */
@Component({
  selector: 'st-error-summary-states',
  imports: [ErrorSummaryComponent, TextFieldComponent],
  templateUrl: './error-summary-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorSummaryStatesComponent {
  protected readonly items = signal<readonly { targetId: string; message: string }[]>([]);
  protected fail(): void {
    this.items.set([{ targetId: 'bookingUrl', message: 'Booking link: Enter a web address' }, { targetId: 'hourlyRate', message: 'Hourly rate: Enter an amount of 0 or more' }]);
  }
}
