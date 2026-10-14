import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeComponent } from '@shot-there/components';

/** A badge of every tone, then solid. */
@Component({
  selector: 'st-badge-tones',
  imports: [BadgeComponent],
  templateUrl: './badge-tones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeTonesComponent {}
