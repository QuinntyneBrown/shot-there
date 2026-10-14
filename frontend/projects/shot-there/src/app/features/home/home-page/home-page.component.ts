import { CurrencyPipe, DOCUMENT, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { StudiosService } from '@shot-there/api';
import { catchError, map, of, startWith } from 'rxjs';

import { EmailSignupComponent } from '../../../core/email-signup/email-signup.component';
import { APP_PATHS } from '../../../core/routing/app-paths';
import { HomePageState } from './home-page-state';

/** How many of the most recent studio reviews the home page shows. */
const LATEST_REVIEW_COUNT = 3;

@Component({
  selector: 'st-home-page',
  imports: [RouterLink, CurrencyPipe, DatePipe, DecimalPipe, EmailSignupComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private readonly document = inject(DOCUMENT);

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

  focusSignup(event: Event): void {
    event.preventDefault();
    this.document.getElementById('hero-email')?.focus();
  }
}
