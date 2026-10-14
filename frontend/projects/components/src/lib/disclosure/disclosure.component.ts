import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/** The DS disclosure callout: a titled statement near the verdict, with the policy link projected inside. */
@Component({
  selector: 'st-disclosure',
  imports: [IconComponent],
  templateUrl: './disclosure.component.html',
  styleUrl: './disclosure.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'disclosure', '[attr.title]': 'null' },
})
export class DisclosureComponent {
  readonly title = input.required<string>();
}
