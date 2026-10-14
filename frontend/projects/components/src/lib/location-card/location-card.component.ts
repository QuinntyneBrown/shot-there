import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../badge/badge.component';
import { ResponsiveImageComponent } from '../responsive-image/responsive-image.component';
import { Fact } from '../types/fact';
import { HeadingLevel } from '../types/heading-level';
import { ResponsiveImage } from '../types/responsive-image';

/** The DS location card: a photo, a name that is a link stretched over the card, meta, facts and slots. */
@Component({
  selector: 'st-location-card',
  imports: [RouterLink, BadgeComponent, ResponsiveImageComponent],
  templateUrl: './location-card.component.html',
  styleUrl: './location-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'location-card' },
})
export class LocationCardComponent {
  readonly name = input.required<string>();
  readonly link = input.required<string>();
  readonly image = input<ResponsiveImage | null>(null);
  readonly imageSizes = input('(min-width: 62rem) 33vw, (min-width: 36rem) 50vw, 100vw');
  readonly priority = input(false, { transform: booleanAttribute });
  readonly headingLevel = input<HeadingLevel>(3);
  readonly meta = input<string | null>(null);
  readonly facts = input<readonly Fact[]>([]);
  readonly rank = input<number | null>(null);
  readonly secondaryMeta = input<string | null>(null);
  readonly badge = input<string | null>(null);
}
