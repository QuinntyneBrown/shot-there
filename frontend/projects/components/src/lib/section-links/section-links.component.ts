import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { SectionLink } from '../types/section-link';

/** The DS section list: full-row links with a title and a meta line, the current one marked. */
@Component({
  selector: 'st-section-links',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './section-links.component.html',
  styleUrl: './section-links.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionLinksComponent {
  readonly items = input.required<readonly SectionLink[]>();
  readonly navLabel = input.required<string>();
}
