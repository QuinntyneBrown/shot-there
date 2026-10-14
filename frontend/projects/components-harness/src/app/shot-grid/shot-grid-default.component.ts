import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ShotGridComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/** A shot grid with a setup line, titles and captions; presses are logged. */
@Component({
  selector: 'st-shot-grid-default',
  imports: [ShotGridComponent, ActivationLogComponent],
  templateUrl: './shot-grid-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShotGridDefaultComponent {
  private readonly image = {
    alt: 'Close portrait against the brick wall.',
    width: 1600,
    height: 2000,
    sources: [{ format: 'webp', srcset: '/test-images/9f2c41/480.webp 480w, /test-images/9f2c41/960.webp 960w' }, { format: 'jpeg', srcset: '/test-images/9f2c41/480.jpeg 480w, /test-images/9f2c41/960.jpeg 960w' }],
    fallbackUrl: '/test-images/9f2c41/960.jpeg',
  };
  protected readonly log = signal<readonly string[]>([]);
  protected readonly shots = [
    { image: this.image, caption: 'Octabox at 45 degrees.', title: 'Standard' },
    { image: this.image, caption: 'Window light only.' },
  ];
}
