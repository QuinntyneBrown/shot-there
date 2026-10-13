import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

/** Lists every harness route, one per component state. */
@Component({
  selector: 'st-harness-index',
  imports: [RouterLink],
  templateUrl: './harness-index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HarnessIndexComponent {
  protected readonly paths = inject(Router)
    .config.map((route) => route.path ?? '')
    .filter((path) => path !== '' && path !== '**');
}
