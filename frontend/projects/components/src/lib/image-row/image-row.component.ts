import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ImageRowState } from '../types/image-row-state';

/** The DS image row: a thumbnail (or a rank disc), meta, the projected fields and an actions slot. */
@Component({
  selector: 'li[st-image-row]',
  imports: [IconComponent],
  templateUrl: './image-row.component.html',
  styleUrl: './image-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'image-row',
    '[class.image-row--entry]': 'rank() !== null',
    '[class.image-row--uploading]': "state() === 'uploading'",
    '[class.image-row--failed]': "state() === 'failed'",
  },
})
export class ImageRowComponent {
  readonly thumbnailUrl = input<string | null>(null);
  readonly rank = input<number | null>(null);
  readonly state = input<ImageRowState>('ready');
  readonly statusText = input<string | null>(null);
  readonly meta = input.required<string>();
}
