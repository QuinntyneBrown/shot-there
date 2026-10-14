import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ActiveFilter } from '../types/active-filter';

/** The DS active filters row: a removable chip per filter and a Clear all link. Renders nothing when empty. */
@Component({
  selector: 'st-active-filters',
  imports: [IconComponent],
  templateUrl: './active-filters.component.html',
  styleUrl: './active-filters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveFiltersComponent {
  readonly filters = input.required<readonly ActiveFilter[]>();
  readonly label = input($localize`:@@st.activeFilters.label:Active filters:`);
  readonly removeLabel = input($localize`:@@st.activeFilters.remove:Remove filter:`);
  readonly clearLabel = input($localize`:@@st.activeFilters.clear:Clear all`);
  readonly filterRemoved = output<ActiveFilter>();
  readonly cleared = output<void>();
}
