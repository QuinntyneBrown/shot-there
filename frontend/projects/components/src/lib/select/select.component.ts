import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldControl } from '../form/field-control';
import { FieldLabelComponent } from '../form/field-label.component';
import { FieldMessagesComponent } from '../form/field-messages.component';
import { ControlSize } from '../types/control-size';
import { SelectOption } from '../types/select-option';

/** The DS select (.field, .select): a labelled native select over the options it is given. */
@Component({
  selector: 'st-select',
  imports: [FieldLabelComponent, FieldMessagesComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true },
  ],
  host: {
    class: 'field',
    '[class.field--warning]': 'hasWarning()',
    '[class.field--inline]': 'inline()',
  },
})
export class SelectComponent extends FieldControl<string> {
  readonly options = input.required<readonly SelectOption[]>();
  readonly size = input<ControlSize>('md');
  readonly inline = input(false, { transform: booleanAttribute });

  protected empty(): string {
    return '';
  }

  protected chosen(event: Event): void {
    this.commit((event.target as HTMLSelectElement).value);
  }
}
