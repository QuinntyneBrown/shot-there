import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InlineMessageComponent } from '@shot-there/components';

/** Help and error inline messages. */
@Component({
  selector: 'st-inline-message-states',
  imports: [InlineMessageComponent],
  templateUrl: './inline-message-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineMessageStatesComponent {}
