import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SearchFieldComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

/** A guide-entry search with suggestions, no-results and a busy state. */
@Component({
  selector: 'st-search-field-default',
  imports: [SearchFieldComponent, ReactiveFormsModule, ActivationLogComponent],
  templateUrl: './search-field-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldDefaultComponent {
  protected readonly query = new FormControl('', { nonNullable: true });
  protected readonly log = signal<readonly string[]>([]);
  protected readonly all = [{ value: 'junction', label: 'The Junction Loft', meta: 'Studio' }, { value: 'justine', label: 'Justine Park', meta: 'Spot' }];

  protected options(): readonly { value: string; label: string; meta?: string }[] {
    const q = this.query.value.toLowerCase();
    return q ? this.all.filter((o) => o.label.toLowerCase().includes(q)) : [];
  }
}
