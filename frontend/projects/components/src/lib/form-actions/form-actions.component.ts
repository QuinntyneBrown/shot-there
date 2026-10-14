import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The DS form actions row: buttons and the save status, optionally sticky at the bottom with safe-area padding. */
@Component({
  selector: 'st-form-actions',
  templateUrl: './form-actions.component.html',
  styleUrl: './form-actions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'form-actions', '[class.form-actions--sticky]': 'sticky()' },
})
export class FormActionsComponent {
  readonly sticky = input(false, { transform: booleanAttribute });
}
