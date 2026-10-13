import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { StudiosService, StudioSummary } from '@shot-there/api';
import { BehaviorSubject, catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';

import { StudioCardComponent } from '../studio-card/studio-card.component';
import { StudioSortControlComponent } from '../studio-sort-control/studio-sort-control.component';
import { parseStudioListQuery } from './parse-studio-list-query';
import { StudioListQuery } from './studio-list-query';
import { StudioListState } from './studio-list-state';
import { StudioSort } from './studio-sort';
import { toStudioListQueryParams } from './to-studio-list-query-params';

@Component({
  selector: 'st-studio-list-page',
  imports: [StudioCardComponent, StudioSortControlComponent],
  templateUrl: './studio-list-page.component.html',
  styleUrl: './studio-list-page.component.css'
})
export class StudioListPageComponent {
  private readonly studiosService = inject(StudiosService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly retries = new BehaviorSubject<void>(undefined);
  private readonly query$ = this.route.queryParamMap.pipe(map(parseStudioListQuery));

  protected readonly query = toSignal(this.query$, { requireSync: true });
  protected readonly state = toSignal(
    combineLatest([this.query$, this.retries]).pipe(
      switchMap(([query]) =>
        this.studiosService.listStudios(toStudioListQueryParams(query)).pipe(
          map((studios): StudioListState => ({ status: 'loaded', studios })),
          catchError(() => of<StudioListState>({ status: 'error' })),
          startWith<StudioListState>({ status: 'loading' })
        )
      )
    ),
    { initialValue: { status: 'loading' } as StudioListState }
  );
  /** Six placeholder cards: two rows at LG. */
  protected readonly skeletons = [1, 2, 3, 4, 5, 6];
  protected readonly studios = computed<StudioSummary[]>(() => {
    const state = this.state();
    return state.status === 'loaded' ? state.studios : [];
  });

  retry(): void {
    this.retries.next();
  }

  changeSort(sort: StudioSort): void {
    this.applyQuery({ ...this.query(), sort });
  }

  private applyQuery(query: StudioListQuery): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: toStudioListQueryParams(query) });
  }
}
