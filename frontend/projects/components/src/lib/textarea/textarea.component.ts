import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  forwardRef,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldControl } from '../form/field-control';
import { FieldLabelComponent } from '../form/field-label.component';
import { FieldMessagesComponent } from '../form/field-messages.component';

/** The DS textarea (.field, .textarea) with an optional character counter and over-limit state. */
@Component({
  selector: 'st-textarea',
  imports: [FieldLabelComponent, FieldMessagesComponent],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextareaComponent), multi: true },
  ],
  host: {
    class: 'field',
    '[class.field--warning]': 'hasWarning()',
  },
})
export class TextareaComponent extends FieldControl<string> {
  readonly rows = input(4, { transform: numberAttribute });
  readonly maxlength = input<number | null, unknown>(null, {
    transform: (v) => (v == null ? null : numberAttribute(v)),
  });

  private readonly announcedText = signal('');
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected readonly count = computed(() => this.value().length);
  protected readonly over = computed(
    () => this.maxlength() !== null && this.count() > (this.maxlength() as number),
  );
  protected readonly counter = computed(() => this.counterText(this.count()));
  protected readonly announced = this.announcedText.asReadonly();
  protected readonly counterId = computed(() => this.id() + '-counter');
  protected readonly describedByAll = computed(() => {
    const ids = [this.describedBy(), this.maxlength() !== null ? this.counterId() : null].filter(
      Boolean,
    );
    return ids.length ? ids.join(' ') : null;
  });

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected empty(): string {
    return '';
  }

  private counterText(count: number): string {
    return $localize`:@@st.textarea.counter:${count}:count: of ${this.maxlength()}:max: characters`;
  }

  protected typedText(event: Event): void {
    const text = (event.target as HTMLTextAreaElement).value;
    this.commit(text);
    // The live region speaks once typing pauses, not on every keystroke.
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.announcedText.set(this.counterText(text.length)), 1000);
  }
}
