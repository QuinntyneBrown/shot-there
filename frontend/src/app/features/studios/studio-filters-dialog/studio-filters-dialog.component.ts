import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { StudiosService } from '@shot-there/api';
import { catchError, debounceTime, map, of, startWith, switchMap } from 'rxjs';

import { StudioFiltersComponent } from '../studio-filters/studio-filters.component';
import { StudioListQuery } from '../studio-list-page/studio-list-query';
import { StudioSort } from '../studio-list-page/studio-sort';
import { toStudioListQueryParams } from '../studio-list-page/to-studio-list-query-params';
import { withoutFilters } from '../studio-list-page/without-filters';
import { STUDIO_SORT_OPTIONS } from '../studio-sort-control/studio-sort-options';
import { costRangeError } from './cost-range-error';
import { StudioFiltersDialogData } from './studio-filters-dialog-data';

/** Full-height filters below LG. Closes with the query to apply, or nothing when dismissed. */
@Component({
  selector: 'st-studio-filters-dialog',
  imports: [StudioFiltersComponent],
  templateUrl: './studio-filters-dialog.component.html',
  styleUrl: './studio-filters-dialog.component.css'
})
export class StudioFiltersDialogComponent {
  private readonly dialogRef = inject<DialogRef<StudioListQuery>>(DialogRef);
  private readonly studiosService = inject(StudiosService);

  protected readonly draft = signal(inject<StudioFiltersDialogData>(DIALOG_DATA).query);
  protected readonly sortOptions = STUDIO_SORT_OPTIONS;
  protected readonly costError = computed(() => costRangeError(this.draft()));
  /** How many studios the draft matches; null while counting, after a failure, or for an invalid range. */
  protected readonly matchCount = toSignal(
    toObservable(this.draft).pipe(
      debounceTime(250),
      switchMap((query) =>
        costRangeError(query)
          ? of(null)
          : this.studiosService.listStudios(toStudioListQueryParams(query)).pipe(
              map((studios) => studios.length),
              catchError(() => of(null)),
              startWith(null)
            )
      )
    ),
    { initialValue: null }
  );

  setSort(sort: string): void {
    this.draft.update((query) => ({ ...query, sort: sort as StudioSort }));
  }

  clearAll(): void {
    this.draft.update(withoutFilters);
  }

  apply(): void {
    if (!this.costError()) {
      this.dialogRef.close(this.draft());
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
