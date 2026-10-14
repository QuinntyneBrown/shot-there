import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TextFieldComponent } from '@shot-there/components';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

/** Text fields: plain with help, prefixed number, password with reveal, search, optional, with error and warning. */
@Component({
  selector: 'st-text-field-states',
  imports: [TextFieldComponent, ReactiveFormsModule],
  templateUrl: './text-field-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextFieldStatesComponent {
  protected readonly rate = new FormControl('', { nonNullable: true });
  protected readonly name = new FormControl('Junction', { nonNullable: true });
  protected readonly error = signal<string | null>(null);
}
