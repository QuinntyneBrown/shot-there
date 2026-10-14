import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The DS compare bar: fixed to the bottom while studios are selected, announcing the count politely. */
@Component({
  selector: 'st-compare-bar',
  templateUrl: './compare-bar.component.html',
  styleUrl: './compare-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'compare-bar', role: 'complementary', '[attr.aria-label]': 'label()' },
})
export class CompareBarComponent {
  readonly label = input.required<string>();
  readonly countText = input.required<string>();
  readonly hint = input<string | null>(null);
  readonly hintId = input('compare-hint');
  readonly names = input<string | null>(null);
}
