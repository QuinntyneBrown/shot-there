import { DOCUMENT } from '@angular/common';
import { Component, LOCALE_ID, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { StudiosService } from '@shot-there/api';
import { ButtonComponent, EmptyStateComponent, LinkComponent, LocationCardComponent, LocationGridComponent } from '@shot-there/components';
import { catchError, map, of, startWith } from 'rxjs';

import { EmailSignupComponent } from '../../../core/email-signup/email-signup.component';
import { APP_PATHS } from '../../../core/routing/app-paths';
import { toStudioCardViewModel } from '../../studios/studio-card/studio-card.view-model';
import { HomePageState } from './home-page-state';

/** How many of the most recent studio reviews the home page shows. */
const LATEST_REVIEW_COUNT = 3;

@Component({
  selector: 'st-home-page',
  imports: [
    RouterLink,
    EmailSignupComponent,
    ButtonComponent,
    EmptyStateComponent,
    LinkComponent,
    LocationCardComponent,
    LocationGridComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private readonly document = inject(DOCUMENT);
  private readonly locale = inject(LOCALE_ID);

  protected readonly studiosPath = `/${APP_PATHS.studios}`;
  /** The studio list's default order is most recent review first. */
  protected readonly state = toSignal(
    inject(StudiosService)
      .listStudios({})
      .pipe(
        map((studios): HomePageState => ({
          status: 'loaded',
          latestStudios: studios.slice(0, LATEST_REVIEW_COUNT),
        })),
        catchError(() => of<HomePageState>({ status: 'error' })),
        startWith<HomePageState>({ status: 'loading' }),
      ),
    { initialValue: { status: 'loading' } as HomePageState },
  );
  protected readonly latestCards = computed(() => {
    const state = this.state();
    return state.status === 'loaded'
      ? state.latestStudios.map((studio) => ({
          studio,
          view: toStudioCardViewModel(studio, this.locale),
        }))
      : [];
  });

  focusSignup(event: Event): void {
    event.preventDefault();
    this.document.getElementById('hero-email')?.focus();
  }
}
