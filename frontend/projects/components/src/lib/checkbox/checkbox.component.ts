import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldControl } from '../form/field-control';
import { FieldMessagesComponent } from '../form/field-messages.component';

/** The DS single checkbox: a .choice row whose label is the control, with optional description, help and error. */
@Component({
  selector: 'st-checkbox',
  imports: [FieldMessagesComponent],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxComponent), multi: true },
  ],
  host: {
    class: 'field',
    '[class.field--warning]': 'hasWarning()',
  },
})
export class CheckboxComponent extends FieldControl<boolean> {
  readonly description = input<string | null>(null);

  protected empty(): boolean {
    return false;
  }

  protected toggled(event: Event): void {
    this.commit((event.target as HTMLInputElement).checked);
  }
}
