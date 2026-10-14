import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** The DS tag list (.tags): static tags, or link tags to a path the application supplies. */
@Component({
  selector: 'st-tag-list',
  imports: [RouterLink],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListComponent {
  readonly items = input.required<readonly { label: string; link?: string }[]>();
  readonly label = input<string | null>(null);
}
