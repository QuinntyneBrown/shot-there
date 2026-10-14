import { booleanAttribute, computed, Directive, inject, input, signal } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { ControlValueAccessor } from '@angular/forms';

/**
 * Internal base for every form control (ICD-FORM-1 to FORM-6): the shared field inputs, a deterministic
 * generated id, the messages' ids and aria-describedby, and the ControlValueAccessor plumbing.
 * Not exported from the package.
 */
@Directive()
export abstract class FieldControl<T> implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly inputId = input('');
  readonly name = input('');
  readonly help = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly optional = input(false, { transform: booleanAttribute });
  readonly optionalLabel = input($localize`:@@st.field.optional:(optional)`);
  readonly warning = input<string | null>(null);
  readonly labelSuffix = input<string | null>(null);

  private readonly generatedId = inject(_IdGenerator).getId('st-field-');
  protected readonly id = computed(() => this.inputId() || this.generatedId);
  protected readonly value = signal<T>(this.empty());
  protected readonly disabled = signal(false);

  protected readonly hasError = computed(() => !!this.error());
  protected readonly hasWarning = computed(() => !this.hasError() && !!this.warning());
  /** Error or warning first, then help; the order of the rendered messages. */
  protected readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this.hasError()) ids.push(this.id() + '-error');
    else if (this.hasWarning()) ids.push(this.id() + '-warning');
    if (this.help()) ids.push(this.id() + '-help');
    return ids.length ? ids.join(' ') : null;
  });

  private onChange: (value: T) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected abstract empty(): T;

  writeValue(value: T | null): void {
    this.value.set(value ?? this.empty());
  }
  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  /** The user changed the value: keep it and report it. */
  protected commit(value: T): void {
    this.value.set(value);
    this.onChange(value);
  }
  protected touch(): void {
    this.onTouched();
  }
}
