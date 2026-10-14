import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { BreadcrumbItem } from '../types/breadcrumb-item';

/** The DS breadcrumb: a nav of links ending at the current page, optionally collapsing to the parent on phones. */
@Component({
  selector: 'st-breadcrumb',
  imports: [RouterLink, SkeletonComponent],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  readonly items = input.required<readonly BreadcrumbItem[]>();
  readonly label = input($localize`:@@st.breadcrumb.label:Breadcrumb`);
  readonly current = input(true, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly collapse = input(false, { transform: booleanAttribute });
}
