import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';
import { Fact } from '../types/fact';

/** The DS description list (.kv): one dt and dd per fact, with an optional tabular figure, hidden suffix and badge. */
@Component({
  selector: 'st-description-list',
  imports: [BadgeComponent],
  templateUrl: './description-list.component.html',
  styleUrl: './description-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionListComponent {
  readonly items = input.required<readonly Fact[]>();
}
