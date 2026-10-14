import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeadingLevel } from '../types/heading-level';

/** The DS stat tile (.stat-tile): a title (optionally a link), the counts and the tile action. */
@Component({
  selector: 'li[st-stat-tile]',
  imports: [RouterLink],
  templateUrl: './stat-tile.component.html',
  styleUrl: './stat-tile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'stat-tile', '[attr.title]': 'null' },
})
export class StatTileComponent {
  readonly title = input.required<string>();
  readonly counts = input.required<string>();
  readonly link = input<string | null>(null);
  readonly headingLevel = input<HeadingLevel>(2);
}
