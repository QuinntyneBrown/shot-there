import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldControl } from '../form/field-control';
import { ChoiceOption } from '../types/choice-option';

/** The DS checkbox group: a fieldset of .choice checkboxes whose value is the ticked values, in option order. */
@Component({
  selector: 'st-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrl: './checkbox-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true,
    },
  ],
})
export class CheckboxGroupComponent extends FieldControl<string[]> {
  readonly options = input.required<readonly ChoiceOption[]>();
  readonly appearance = input<'form' | 'filter'>('form');

  protected empty(): string[] {
    return [];
  }

  protected optionId(index: number): string {
    return index === 0 ? this.id() : this.id() + '-' + (index + 1);
  }

  protected toggled(option: ChoiceOption, checked: boolean): void {
    const ticked = new Set(this.value());
    if (checked) ticked.add(option.value);
    else ticked.delete(option.value);
    this.commit(
      this.options()
        .filter((o) => ticked.has(o.value))
        .map((o) => o.value),
    );
  }
}
