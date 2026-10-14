import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from '@shot-there/components';


/** One skeleton per shape inside a busy region. */
@Component({
  selector: 'st-skeleton-shapes',
  imports: [SkeletonComponent],
  templateUrl: './skeleton-shapes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonShapesComponent {

}
