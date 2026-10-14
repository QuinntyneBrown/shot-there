import { formatCurrency, formatDate, formatNumber } from '@angular/common';
import { StudioSummary } from '@shot-there/api';
import { Fact, ResponsiveImage } from '@shot-there/components';

import { APP_PATHS } from '../../../core/routing/app-paths';

export function toStudioCardViewModel(studio: StudioSummary, locale: string) {
  const image = {
    alt: '',
    width: studio.thumbnail.width,
    height: studio.thumbnail.height,
    sources: [],
    fallbackUrl: studio.thumbnail.url,
  } satisfies ResponsiveImage;

  const facts: Fact[] = [
    {
      term: $localize`All-in 2 h`,
      detail: formatCurrency(studio.allInCost2h, locale, '$', 'CAD', '1.2-2'),
      numeric: true,
    },
    {
      term: $localize`Score`,
      detail: formatNumber(studio.overallScore, locale, '1.1-1'),
      numeric: true,
      srSuffix: $localize` out of 5`,
    },
  ];

  return {
    link: `/${APP_PATHS.studios}/${studio.slug}`,
    image,
    meta: $localize`${studio.neighbourhood}:neighbourhood: · Reviewed ${formatDate(studio.reviewedAt, 'd MMM y', locale)}:reviewedAt:`,
    facts,
    badge: studio.priceStale ? $localize`Prices may be out of date` : null,
  };
}
