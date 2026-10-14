import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The DS skeleton placeholder. Hidden from assistive technology; the application marks the region busy. */
@Component({
  selector: 'st-skeleton',
  template: '',
  styleUrl: './skeleton.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': "'skeleton skeleton--' + shape()",
    'aria-hidden': 'true',
  },
})
export class SkeletonComponent {
  readonly shape = input<'text' | 'title' | 'pill' | 'rect' | 'circle'>('text');
}
