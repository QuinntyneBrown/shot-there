import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ResponsiveImageComponent } from '../responsive-image/responsive-image.component';
import { Shot } from '../types/shot';

/** The DS shot grid: a button per thumbnail that reports its index, so the application can open the lightbox. */
@Component({
  selector: 'st-shot-grid',
  imports: [ResponsiveImageComponent],
  templateUrl: './shot-grid.component.html',
  styleUrl: './shot-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShotGridComponent {
  readonly shots = input.required<readonly Shot[]>();
  readonly setup = input<string | null>(null);
  readonly sizes = input('(min-width: 62rem) 25vw, (min-width: 48rem) 33vw, 50vw');
  readonly shotActivated = output<number>();
}
