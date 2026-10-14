import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The DS result count: a polite live region announcing how many results the list shows. */
@Component({
  selector: 'st-result-count',
  templateUrl: './result-count.component.html',
  styleUrl: './result-count.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'result-count', role: 'status', 'aria-live': 'polite' },
})
export class ResultCountComponent {
  readonly text = input.required<string>();
  readonly srSuffix = input<string | null>(null);
}
