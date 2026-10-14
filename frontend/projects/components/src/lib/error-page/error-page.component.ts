import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The DS system page (.system-page) for not found and server errors: the page h1, text, a reference and actions. */
@Component({
  selector: 'st-error-page',
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'system-page', '[attr.title]': 'null' },
})
export class ErrorPageComponent {
  readonly code = input<string | null>(null);
  readonly title = input.required<string>();
  readonly text = input<string | null>(null);
  readonly reference = input<string | null>(null);
}
