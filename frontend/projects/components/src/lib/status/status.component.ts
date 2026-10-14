import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContentStatus } from '../types/content-status';

/** The DS status label: a word plus a shape, a hollow ring for a draft and a filled dot once published. */
@Component({
  selector: 'st-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'status',
    '[class.status--draft]': "status() === 'draft'",
    '[class.status--published]': "status() === 'published'",
  },
})
export class StatusComponent {
  readonly status = input.required<ContentStatus>();
}
