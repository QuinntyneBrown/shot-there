import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Tone } from '../types/tone';

/** The DS alert (.alert, .banner): a toned message with an icon, optional title, body, action and dismiss button. */
@Component({
  selector: 'st-alert',
  imports: [IconComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'alert',
    '[class.alert--info]': "tone() === 'info'",
    '[class.alert--success]': "tone() === 'success'",
    '[class.alert--warning]': "tone() === 'warning'",
    '[class.alert--danger]': "tone() === 'danger'",
    '[class.banner]': 'banner()',
    '[attr.role]': 'role()',
    '[attr.title]': 'null',
  },
})
export class AlertComponent {
  readonly tone = input<Exclude<Tone, 'neutral'>>('info');
  readonly title = input<string | null>(null);
  readonly role = input<'alert' | 'status' | null>(null);
  readonly banner = input(false, { transform: booleanAttribute });
  readonly dismissible = input(false, { transform: booleanAttribute });
  readonly dismissLabel = input($localize`:@@st.alert.dismiss:Dismiss`);
  readonly dismissed = output<void>();

  protected readonly icon = computed(() => this.tone());
}
