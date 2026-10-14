import { Clipboard } from '@angular/cdk/clipboard';
import { DOCUMENT } from '@angular/common';
import { Component, LOCALE_ID, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompareService } from '@shot-there/api';
import {
  ButtonComponent,
  EmptyStateComponent,
  FallbackImageDirective,
  IconComponent,
  LinkComponent,
} from '@shot-there/components';
import { map, of, startWith, switchMap } from 'rxjs';

import { AnnouncerService } from '../../../core/a11y/announcer.service';
import { APP_PATHS } from '../../../core/routing/app-paths';
import { formatPageTitle } from '../../../core/routing/format-page-title';
import { PAGE_TITLES } from '../../../core/routing/page-titles';
import { ComparePageState } from './compare-page-state';
import { parseCompareSlugs } from './compare-url';
import { toComparisonViewModel } from './comparison-view-model';

@Component({
  selector: 'st-compare-page',
  imports: [
    RouterLink,
    ButtonComponent,
    EmptyStateComponent,
    FallbackImageDirective,
    IconComponent,
    LinkComponent,
  ],
  templateUrl: './compare-page.component.html',
  styleUrl: './compare-page.component.css',
})
export class ComparePageComponent {
  private readonly compareService = inject(CompareService);
  private readonly locale = inject(LOCALE_ID);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly clipboard = inject(Clipboard);
  private readonly document = inject(DOCUMENT);
  private readonly announcer = inject(AnnouncerService);

  protected readonly studiosPath = `/${APP_PATHS.studios}`;
  protected readonly state = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(
      map((params) => parseCompareSlugs(params.get('studios'))),
      switchMap((slugs) =>
        slugs.length < 2
          ? of<ComparePageState>({ status: 'too-few' })
          : this.compareService.getComparison(slugs).pipe(
              map((dto): ComparePageState => {
                const view = toComparisonViewModel(dto, this.locale);
                return view.canShowTable ? { status: 'loaded', view } : { status: 'too-few' };
              }),
              startWith<ComparePageState>({ status: 'loading' }),
            ),
      ),
    ),
    { initialValue: { status: 'loading' } as ComparePageState },
  );
  protected readonly view = computed(() => {
    const state = this.state();
    return state.status === 'loaded' ? state.view : undefined;
  });

  constructor() {
    effect(() => {
      const view = this.view();
      if (view) {
        this.title.setTitle(formatPageTitle($localize`Compare ${view.namesList}:names:`));
        this.meta.updateTag({
          name: 'description',
          content: $localize`${view.namesList}:names: side by side: all-in cost, measured space and light, scores and the standard test shots.`,
        });
      } else if (this.state().status === 'too-few') {
        this.title.setTitle(formatPageTitle(PAGE_TITLES.compare));
      }
    });
  }

  copyLink(): void {
    if (this.clipboard.copy(this.document.location.href)) {
      this.announcer.announcePolite($localize`Link copied`);
    }
  }
}
