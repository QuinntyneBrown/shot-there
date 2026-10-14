import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { FieldControl } from '../form/field-control';
import { FieldLabelComponent } from '../form/field-label.component';
import { FieldMessagesComponent } from '../form/field-messages.component';
import { IconComponent } from '../icon/icon.component';
import { ControlSize } from '../types/control-size';

/** The DS text field (.field, .input): a labelled native input with help, error, warning, prefix, search icon and password reveal. */
@Component({
  selector: 'st-text-field',
  imports: [
    NgTemplateOutlet,
    ButtonComponent,
    FieldLabelComponent,
    FieldMessagesComponent,
    IconComponent,
  ],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextFieldComponent), multi: true },
  ],
  host: {
    class: 'field',
    '[class.field--warning]': 'hasWarning()',
    '[class.field--inline]': 'inline()',
  },
})
export class TextFieldComponent extends FieldControl<string> {
  readonly type = input<
    'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number' | 'date'
  >('text');
  readonly size = input<ControlSize>('md');
  readonly autocomplete = input('off');
  readonly inputmode = input<string | null>(null);
  readonly spellcheck = input(true, { transform: booleanAttribute });
  readonly min = input<string | null>(null);
  readonly max = input<string | null>(null);
  readonly step = input<string | null>(null);
  readonly maxlength = input<number | null, unknown>(null, {
    transform: (v) => (v == null ? null : numberAttribute(v)),
  });
  readonly prefix = input<string | null>(null);
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly revealLabel = input($localize`:@@st.textField.reveal:Show`);
  readonly concealLabel = input($localize`:@@st.textField.conceal:Hide`);
  readonly revealContext = input($localize`:@@st.textField.revealContext:password`);
  readonly inline = input(false, { transform: booleanAttribute });

  protected readonly revealed = signal(false);

  protected empty(): string {
    return '';
  }

  protected typed(): string {
    return this.type() === 'password' && this.revealed() ? 'text' : this.type();
  }

  protected typedText(event: Event): void {
    this.commit((event.target as HTMLInputElement).value);
  }

  protected toggleReveal(): void {
    this.revealed.update((revealed) => !revealed);
  }
}
