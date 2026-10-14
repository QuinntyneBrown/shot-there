import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Tone } from '../types/tone';

/** The DS badge: a short word in a pill, toned and optionally solid. */
@Component({
  selector: 'st-badge',
  template: '<ng-content />',
  styleUrl: './badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'badge',
    '[class.badge--info]': "tone() === 'info'",
    '[class.badge--success]': "tone() === 'success'",
    '[class.badge--warning]': "tone() === 'warning'",
    '[class.badge--danger]': "tone() === 'danger'",
    '[class.badge--solid]': 'solid()',
  },
})
export class BadgeComponent {
  readonly tone = input<Tone>('neutral');
  readonly solid = input(false, { transform: booleanAttribute });
}
