import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { HeadingLevel } from '../types/heading-level';
import { IconName } from '../types/icon-name';

/** The DS empty state (.empty): an optional icon, a heading, text and a slot for actions. */
@Component({
  selector: 'st-empty-state',
  imports: [IconComponent],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'empty',
    '[class.empty--info]': "tone() === 'info'",
    '[class.empty--success]': "tone() === 'success'",
    '[class.empty--error]': "tone() === 'error'",
    '[class.empty--compact]': 'compact()',
  },
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly text = input<string | null>(null);
  readonly icon = input<IconName | null>(null);
  readonly tone = input<'neutral' | 'info' | 'success' | 'error'>('neutral');
  readonly compact = input(false, { transform: booleanAttribute });
  readonly headingLevel = input<HeadingLevel>(2);
}
