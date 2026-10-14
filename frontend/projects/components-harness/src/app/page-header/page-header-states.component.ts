import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeaderComponent, ButtonComponent } from '@shot-there/components';

/** A page header with subtitle and actions, and a loading one. */
@Component({
  selector: 'st-page-header-states',
  imports: [PageHeaderComponent, ButtonComponent],
  templateUrl: './page-header-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderStatesComponent {}
