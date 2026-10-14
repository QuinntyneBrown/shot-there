import { ChangeDetectionStrategy, Component } from '@angular/core';

/** The DS image list: an ordered list of image rows for the editors. */
@Component({
  selector: 'ol[st-image-list]',
  templateUrl: './image-list.component.html',
  styleUrl: './image-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'image-list' },
})
export class ImageListComponent {}
