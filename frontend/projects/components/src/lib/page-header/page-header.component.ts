import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkeletonComponent } from '../skeleton/skeleton.component';

/** The DS page header: the page h1 with a subtitle slot and an actions slot. */
@Component({
  selector: 'st-page-header',
  imports: [SkeletonComponent],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page-header', '[attr.title]': 'null' },
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly loading = input(false, { transform: booleanAttribute });
}
