import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Lists what the harness's listeners received, so specs can assert what a component let through. */
@Component({
  selector: 'st-activation-log',
  templateUrl: './activation-log.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivationLogComponent {
  readonly entries = input.required<readonly string[]>();
}
