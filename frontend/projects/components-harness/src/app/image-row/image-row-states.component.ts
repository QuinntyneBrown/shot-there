import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImageListComponent, ImageRowComponent, ProgressComponent, ButtonComponent } from '@shot-there/components';

/** An image list with a ready row, an uploading row and a failed row. */
@Component({
  selector: 'st-image-row-states',
  imports: [ImageListComponent, ImageRowComponent, ProgressComponent, ButtonComponent],
  templateUrl: './image-row-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageRowStatesComponent {}
