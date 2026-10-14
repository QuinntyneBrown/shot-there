import { booleanAttribute, ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldControl } from '../form/field-control';
import { FieldLabelComponent } from '../form/field-label.component';
import { FieldMessagesComponent } from '../form/field-messages.component';
import { IconComponent } from '../icon/icon.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SuggestionOption } from '../types/suggestion-option';

/** The DS search field (combobox): a query input with a listbox of suggestions the application supplies. */
@Component({
  selector: 'st-search-field',
  imports: [FieldLabelComponent, FieldMessagesComponent, IconComponent, SpinnerComponent],
  templateUrl: './search-field.component.html',
  styleUrl: './search-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SearchFieldComponent), multi: true }],
  host: { class: 'field' },
})
export class SearchFieldComponent extends FieldControl<string> {
  readonly options = input<readonly SuggestionOption[]>([]);
  readonly busy = input(false, { transform: booleanAttribute });
  readonly listLabel = input.required<string>();
  readonly noResultsText = input<string | null>(null);
  readonly resultsText = input<string | null>(null);
  readonly busyLabel = input($localize`:@@st.searchField.busy:Searching…`);
  readonly optionSelected = output<SuggestionOption>();

  protected readonly open = signal(false);
  protected readonly active = signal(-1);
  protected readonly listId = computed(() => this.id() + '-list');
  protected readonly expanded = computed(() => this.open() && this.value().length > 0 && (this.options().length > 0 || !!this.noResultsText() || this.busy()));

  protected empty(): string {
    return '';
  }

  protected optionId(index: number): string {
    return this.id() + '-option-' + index;
  }

  protected typedText(event: Event): void {
    this.commit((event.target as HTMLInputElement).value);
    this.open.set(true);
    this.active.set(-1);
  }

  protected keyed(event: KeyboardEvent): void {
    const count = this.options().length;
    if (event.key === 'ArrowDown' && count) {
      event.preventDefault();
      this.open.set(true);
      this.active.set((this.active() + 1) % count);
    } else if (event.key === 'ArrowUp' && count) {
      event.preventDefault();
      this.active.set(this.active() <= 0 ? count - 1 : this.active() - 1);
    } else if (event.key === 'Enter' && this.expanded() && this.active() >= 0) {
      event.preventDefault();
      this.choose(this.options()[this.active()]);
    } else if (event.key === 'Escape' && this.open()) {
      event.preventDefault();
      this.open.set(false);
    }
  }

  protected choose(option: SuggestionOption): void {
    this.open.set(false);
    this.optionSelected.emit(option);
  }
}
