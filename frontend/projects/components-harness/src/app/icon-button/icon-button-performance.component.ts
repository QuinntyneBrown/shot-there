import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { IconButtonComponent } from '@shot-there/components';

/** The lightbox's Close, Previous and Next over a 24-photo gallery; the status line shows the position. */
@Component({
  selector: 'st-icon-button-performance',
  imports: [IconButtonComponent],
  templateUrl: './icon-button-performance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonPerformanceComponent {
  protected readonly total = 24;
  protected readonly index = signal(0);
  protected readonly position = computed(() => `Photo ${this.index() + 1} of ${this.total}`);

  protected step(by: number): void {
    this.index.update((i) => (i + by + this.total) % this.total);
  }
}
