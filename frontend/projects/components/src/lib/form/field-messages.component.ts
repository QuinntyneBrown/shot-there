import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Internal: the error or warning, then the help, of a field, with the ids aria-describedby names. Not exported. */
@Component({
  selector: 'st-field-messages',
  templateUrl: './field-messages.component.html',
  styleUrl: './field-messages.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldMessagesComponent {
  readonly id = input.required<string>();
  readonly error = input<string | null>(null);
  readonly warning = input<string | null>(null);
  readonly help = input<string | null>(null);
}
