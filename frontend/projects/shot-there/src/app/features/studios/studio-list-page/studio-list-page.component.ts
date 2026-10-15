import { Component, computed, effect, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { StudiosService, StudioSummary } from '@shot-there/api';
import {
  AlertComponent,
  ButtonComponent,
  DialogService,
  EmptyStateComponent,
  FilterTriggerComponent,
  IconComponent,
  LocationCardSkeletonComponent,
  LocationGridComponent,
  ResultCountComponent,
} from '@shot-there/components';
import { BehaviorSubject, catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';

import { AnnouncerService } from '../../../core/a11y/announcer.service';
import { StudioCardComponent } from '../studio-card/studio-card.component';
import { StudioFiltersComponent } from '../studio-filters/studio-filters.component';
import { StudioFiltersDialogComponent } from '../studio-filters-dialog/studio-filters-dialog.component';
import { StudioFiltersDialogData } from '../studio-filters-dialog/studio-filters-dialog-data';
import { StudioSortControlComponent } from '../studio-sort-control/studio-sort-control.component';
import { countActiveFilters } from './count-active-filters';
import { parseStudioListQuery } from './parse-studio-list-query';
import { StudioListQuery } from './studio-list-query';
import { StudioListState } from './studio-list-state';
import { StudioSort } from './studio-sort';
import { toStudioListQueryParams } from './to-studio-list-query-params';
import { withoutFilters } from './without-filters';

@Component({
  selector: 'app-studio-list-page',
  imports: [
    ResultCountComponent,
    StudioCardComponent,
    StudioSortControlComponent,
    StudioFiltersComponent,
    AlertComponent,
    ButtonComponent,
    EmptyStateComponent,
    FilterTriggerComponent,
    IconComponent,
    LocationCardSkeletonComponent,
    LocationGridComponent,
  ],
  templateUrl: './studio-list-page.component.html',
  styleUrl: './studio-list-page.component.css',
})
export class StudioListPageComponent {
  private readonly studiosService = inject(StudiosService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly announcer = inject(AnnouncerService);
  private readonly dialog = inject(DialogService);
  private readonly retries = new BehaviorSubject<void>(undefined);
  private readonly query$ = this.route.queryParamMap.pipe(map(parseStudioListQuery));
  private announceNextCount = false;

  protected readonly query = toSignal(this.query$, { requireSync: true });
  protected readonly resultCountText = computed(() => {
    const state = this.state();
    if (state.status === 'loading') {
      return $localize`Loading studios…`;
    }
    if (state.status !== 'loaded') {
      return '';
    }
    const count = state.studios.length;
    return count === 1 ? $localize`1 studio` : $localize`${count}:count: studios`;
  });
  protected readonly activeFilterCount = computed(() => countActiveFilters(this.query()));
  /** The sidebar's unapplied filters; reset whenever the URL changes. */
  protected readonly sidebarDraft = linkedSignal(() => this.query());
  protected readonly state = toSignal(
    combineLatest([this.query$, this.retries]).pipe(
      switchMap(([query]) =>
        this.studiosService.listStudios(toStudioListQueryParams(query)).pipe(
          map((studios): StudioListState => ({ status: 'loaded', studios })),
          catchError(() => of<StudioListState>({ status: 'error' })),
          startWith<StudioListState>({ status: 'loading' }),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as StudioListState },
  );
  /** Six placeholder cards: two rows at LG. */
  protected readonly skeletons = [1, 2, 3, 4, 5, 6];
  protected readonly studios = computed<StudioSummary[]>(() => {
    const state = this.state();
    return state.status === 'loaded' ? state.studios : [];
  });
  /** Nothing is published at all, so there is nothing to filter or sort. */
  protected readonly noStudiosYet = computed(
    () =>
      this.state().status === 'loaded' &&
      this.studios().length === 0 &&
      this.activeFilterCount() === 0,
  );

  constructor() {
    effect(() => {
      if (this.state().status === 'loaded' && this.announceNextCount) {
        this.announceNextCount = false;
        const count = this.studios().length;
        this.announcer.announcePolite(
          count === 1 ? $localize`1 studio` : $localize`${count}:count: studios`,
        );
      }
    });
  }

  retry(): void {
    this.retries.next();
  }

  changeSort(sort: StudioSort): void {
    this.applyQuery({ ...this.query(), sort });
  }

  applyFilters(query: StudioListQuery): void {
    this.announceNextCount = true;
    this.applyQuery(query);
  }

  openFiltersDialog(): void {
    const ref = this.dialog.open<
      StudioListQuery,
      StudioFiltersDialogData,
      StudioFiltersDialogComponent
    >(
      StudioFiltersDialogComponent,
      { kind: 'sheet', data: { query: this.query() } },
    );
    ref.componentInstance?.applied.subscribe((query) => ref.close(query));
    ref.closed.subscribe((query) => {
      if (query) {
        this.applyFilters(query);
      }
    });
  }

  clearFilters(): void {
    this.applyFilters(withoutFilters(this.query()));
  }

  private applyQuery(query: StudioListQuery): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: toStudioListQueryParams(query),
    });
  }
}
