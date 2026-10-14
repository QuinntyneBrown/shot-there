import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Fact } from '../types/fact';

/** The DS summary panel: an aside of key facts, with tags, a primary button and a caption projected below. */
@Component({
  selector: 'st-summary-panel',
  templateUrl: './summary-panel.component.html',
  styleUrl: './summary-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'summary-panel', role: 'complementary', '[attr.aria-label]': 'label()' },
})
export class SummaryPanelComponent {
  readonly label = input.required<string>();
  readonly facts = input.required<readonly Fact[]>();
}
