import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SummaryPanelComponent, TagListComponent, ButtonComponent } from '@shot-there/components';

/** A summary panel with facts, tags and a button. */
@Component({
  selector: 'st-summary-panel-default',
  imports: [SummaryPanelComponent, TagListComponent, ButtonComponent],
  templateUrl: './summary-panel-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryPanelDefaultComponent {
  protected readonly facts = [{ term: 'All-in', detail: '$145.00' }, { term: 'Score', detail: '3.8', srSuffix: ' out of 5' }];
  protected readonly tags = [{ label: 'Portrait' }, { label: 'Brand' }];
}
