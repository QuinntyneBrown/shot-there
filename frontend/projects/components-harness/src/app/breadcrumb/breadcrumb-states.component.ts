import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbComponent } from '@shot-there/components';

/** A breadcrumb, a loading one and a non-current one. */
@Component({
  selector: 'st-breadcrumb-states',
  imports: [BreadcrumbComponent],
  templateUrl: './breadcrumb-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbStatesComponent {
  protected readonly items = [{ label: 'Studios', link: '/admin/studios' }, { label: 'The Junction Loft' }];
}
