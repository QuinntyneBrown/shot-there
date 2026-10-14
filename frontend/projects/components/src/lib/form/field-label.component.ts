import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Internal: the .field__label with its hidden suffix and optional marker. Not exported. */
@Component({
  selector: 'st-field-label',
  templateUrl: './field-label.component.html',
  styleUrl: './field-label.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldLabelComponent {
  readonly for = input.required<string>();
  readonly label = input.required<string>();
  readonly suffix = input<string | null>(null);
  readonly optional = input(false);
  readonly optionalLabel = input('');
}
