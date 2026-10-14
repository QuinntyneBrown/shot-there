import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A message outside a field (.field__help or .field__error) on a native paragraph; the consumer writes role and id. */
@Component({
  selector: 'p[st-inline-message]',
  templateUrl: './inline-message.component.html',
  styleUrl: './inline-message.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.field__help]': "tone() === 'help'",
    '[class.field__error]': "tone() === 'error'",
  },
})
export class InlineMessageComponent {
  readonly tone = input<'help' | 'error'>('help');
}
