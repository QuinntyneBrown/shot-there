import { formatCurrency, formatDate, formatNumber } from '@angular/common';
import {
  ComparedStudioDto,
  ComparisonDto,
  ImageDto,
  LightRating,
  LoadIn,
  RubricCategory,
} from '@shot-there/api';
import { ResponsiveImage } from '@shot-there/components';

import { imageSrc, imageSrcset } from '../../studios/studio-page/image-srcset';

import { ComparisonCell } from './comparison-cell';
import { ComparisonRow } from './comparison-row';
import { ComparisonViewModel } from './comparison-view-model-type';

const MISSING = '—';

function toResponsiveImage(image: ImageDto): ResponsiveImage {
  return {
    alt: image.alt,
    width: 800,
    height: 1000,
    sources: [{ format: 'jpeg', srcset: imageSrcset(image) }],
    fallbackUrl: imageSrc(image),
  };
}

const LIGHT_LABELS: Record<LightRating, string> = {
  none: $localize`None`,
  low: $localize`Low`,
  medium: $localize`Medium`,
  strong: $localize`Strong`,
};

const LOAD_IN_LABELS: Record<LoadIn, string> = {
  stairs: $localize`Stairs`,
  elevator: $localize`Elevator`,
  freightElevator: $localize`Freight elevator`,
};

const RUBRIC: readonly { category: RubricCategory; label: string }[] = [
  { category: 'value', label: $localize`Value` },
  { category: 'light', label: $localize`Light` },
  { category: 'space', label: $localize`Space` },
  { category: 'gear', label: $localize`Gear` },
  { category: 'logistics', label: $localize`Logistics` },
  { category: 'condition', label: $localize`Condition` },
];

const NUMBER_WORDS: Record<number, string> = {
  1: $localize`one`,
  2: $localize`two`,
  3: $localize`three`,
  4: $localize`four`,
};

/** Builds the comparison table in the row order of L2-031, with "—" for missing values and the cheapest marked "Lowest". */
export function toComparisonViewModel(dto: ComparisonDto, locale: string): ComparisonViewModel {
  const studios = dto.studios;
  const money = (value: number) => formatCurrency(value, locale, '$', 'CAD', '1.2-2');
  const metres = (value: number) => formatNumber(value, locale, '1.1-1');
  const row = (
    label: string,
    cell: (studio: ComparedStudioDto) => ComparisonCell,
  ): ComparisonRow => ({ label, cells: studios.map(cell) });
  const text = (value: string | null | undefined): ComparisonCell => ({
    text: value ? value : MISSING,
  });

  const shotCount = Math.max(0, ...studios.map((studio) => studio.testShots.length));
  const shotRows = Array.from({ length: shotCount }, (_, i) => {
    const caption = studios.find((studio) => studio.testShots[i]?.caption)?.testShots[i].caption;
    const label = caption
      ? $localize`Shot ${i + 1}:number: · ${caption}:caption:`
      : $localize`Shot ${i + 1}:number:`;
    return row(label, (studio) =>
      studio.testShots[i]
        ? { text: studio.testShots[i].alt, image: toResponsiveImage(studio.testShots[i]) }
        : text(null),
    );
  });

  return {
    columns: studios.map((studio) => ({ slug: studio.slug, name: studio.name })),
    canShowTable: studios.length >= 2,
    namesList: new Intl.ListFormat(locale, { type: 'conjunction' }).format(
      studios.map((studio) => studio.name),
    ),
    notices: notices(dto),
    groups: [
      {
        label: $localize`Cost`,
        rows: [
          row($localize`All-in, 2 hours`, (s) => ({
            text: money(s.allInCost2h),
            isStrong: true,
            isLowest: s.isLowestAllInCost,
            isStale: s.priceStale,
          })),
          row($localize`Hourly rate`, (s) => text(money(s.hourlyRate))),
          row($localize`Minimum booking`, (s) =>
            text(
              s.minimumBookingHours === 1
                ? $localize`1 hour`
                : $localize`${s.minimumBookingHours}:hours: hours`,
            ),
          ),
          row($localize`Mandatory fees`, (s) =>
            text(s.mandatoryFees.map((fee) => `${fee.name} ${money(fee.amount)}`).join(', ')),
          ),
          row($localize`Prices verified`, (s) =>
            text(formatDate(s.priceLastVerified, 'd MMM y', locale)),
          ),
        ],
      },
      {
        label: $localize`Space and light`,
        rows: [
          row($localize`Usable space`, (s) =>
            text(
              s.usableWidthM !== null && s.usableDepthM !== null
                ? $localize`${metres(s.usableWidthM)}:width: m × ${metres(s.usableDepthM)}:depth: m`
                : null,
            ),
          ),
          row($localize`Ceiling height`, (s) =>
            text(
              s.ceilingHeightM !== null ? $localize`${metres(s.ceilingHeightM)}:height: m` : null,
            ),
          ),
          row($localize`Natural light`, (s) =>
            s.naturalLight
              ? {
                  text: '',
                  lines: [
                    $localize`Morning: ${LIGHT_LABELS[s.naturalLight.morning]}:rating:`,
                    $localize`Midday: ${LIGHT_LABELS[s.naturalLight.midday]}:rating:`,
                    $localize`Afternoon: ${LIGHT_LABELS[s.naturalLight.afternoon]}:rating:`,
                    $localize`Evening: ${LIGHT_LABELS[s.naturalLight.evening]}:rating:`,
                  ],
                }
              : text(null),
          ),
          row($localize`Cyc wall`, (s) =>
            text(
              s.hasCycWall === null
                ? null
                : !s.hasCycWall
                  ? $localize`No`
                  : s.cycWallCondition
                    ? $localize`Yes · ${s.cycWallCondition}:condition:`
                    : $localize`Yes`,
            ),
          ),
        ],
      },
      {
        label: $localize`Gear and logistics`,
        rows: [
          row($localize`Included gear`, (s) => text(s.includedGear.join(', '))),
          row($localize`Parking`, (s) => text(s.parking)),
          row($localize`Load-in`, (s) =>
            text(
              s.loadIn ? [LOAD_IN_LABELS[s.loadIn], s.loadInNote].filter(Boolean).join(', ') : null,
            ),
          ),
        ],
      },
      {
        label: $localize`Scores`,
        rows: [
          ...RUBRIC.map((item) =>
            row(item.label, (s) => {
              const score = s.rubricScores.find((entry) => entry.category === item.category)?.score;
              return score === undefined ? text(null) : { text: String(score), isScore: true };
            }),
          ),
          row($localize`Overall`, (s) => ({
            text: formatNumber(s.overallScore, locale, '1.1-1'),
            isScore: true,
            isStrong: true,
          })),
        ],
      },
      { label: $localize`Test shots`, rows: shotRows },
    ],
  };
}

function notices(dto: ComparisonDto): string[] {
  const result: string[] = [];
  const missing = dto.notFoundSlugs.length;
  if (missing > 0 && dto.studios.length >= 2) {
    const others = NUMBER_WORDS[dto.studios.length] ?? String(dto.studios.length);
    result.push(
      missing === 1
        ? $localize`One studio in this link couldn't be found, so we're comparing the other ${others}:count:.`
        : $localize`${missing}:missing: studios in this link couldn't be found, so we're comparing the other ${others}:count:.`,
    );
  }
  if (dto.truncated) {
    result.push(
      $localize`You can compare up to 4 studios. We're showing the first 4 from this link.`,
    );
  }
  return result;
}
