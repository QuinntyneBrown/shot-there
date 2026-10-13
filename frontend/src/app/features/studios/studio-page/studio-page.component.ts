import { HttpErrorResponse } from '@angular/common/http';
import { Component, RESPONSE_INIT, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { StudioService } from '@shot-there/api';
import { catchError, map, of, startWith, switchMap, throwError } from 'rxjs';

import { formatPageTitle } from '../../../core/routing/format-page-title';
import { PAGE_TITLES } from '../../../core/routing/page-titles';
import { NotFoundPageComponent } from '../../errors/not-found-page.component';
import { StudioBasicsComponent } from '../studio-basics/studio-basics.component';
import { StudioPricingComponent } from '../studio-pricing/studio-pricing.component';
import { StudioPageState } from './studio-page-state';

@Component({
  selector: 'st-studio-page',
  imports: [NotFoundPageComponent, StudioBasicsComponent, StudioPricingComponent],
  templateUrl: './studio-page.component.html',
  styleUrl: './studio-page.component.css'
})
export class StudioPageComponent {
  private readonly studioService = inject(StudioService);
  private readonly title = inject(Title);
  /** Present only while rendering on the server; lets a missing studio answer 404. */
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });

  protected readonly state = toSignal(
    inject(ActivatedRoute).paramMap.pipe(
      map((params) => params.get('slug') ?? ''),
      switchMap((slug) =>
        this.studioService.getStudio(slug).pipe(
          map((studio): StudioPageState => ({ status: 'loaded', studio })),
          catchError((error: unknown) =>
            error instanceof HttpErrorResponse && error.status === 404 ? of<StudioPageState>({ status: 'not-found' }) : throwError(() => error)
          ),
          startWith<StudioPageState>({ status: 'loading' })
        )
      )
    ),
    { initialValue: { status: 'loading' } as StudioPageState }
  );
  protected readonly studio = computed(() => {
    const state = this.state();
    return state.status === 'loaded' ? state.studio : undefined;
  });

  constructor() {
    effect(() => {
      const state = this.state();
      if (state.status === 'loaded') {
        this.title.setTitle(formatPageTitle(state.studio.basics.name));
      } else if (state.status === 'not-found') {
        this.title.setTitle(formatPageTitle(PAGE_TITLES.notFound));
        if (this.responseInit) {
          this.responseInit.status = 404;
        }
      }
    });
  }
}
