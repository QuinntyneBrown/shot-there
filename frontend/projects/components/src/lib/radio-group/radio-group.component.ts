import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldControl } from '../form/field-control';
import { ChoiceOption } from '../types/choice-option';

/** The DS radio group: a fieldset of .choice radios sharing one name; arrow keys move the selection natively. */
@Component({
  selector: 'st-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioGroupComponent), multi: true }],
})
export class RadioGroupComponent extends FieldControl<string> {
  readonly options = input.required<readonly ChoiceOption[]>();
  readonly appearance = input<'form' | 'filter'>('form');

  protected empty(): string {
    return '';
  }

  protected optionId(index: number): string {
    return index === 0 ? this.id() : this.id() + '-' + (index + 1);
  }

  protected chosen(option: ChoiceOption): void {
    this.commit(option.value);
  }
}
