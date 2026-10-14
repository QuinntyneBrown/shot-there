import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionLinksComponent } from '@shot-there/components';

/** Section links with a meta line and one needing attention. */
@Component({
  selector: 'st-section-links-default',
  imports: [SectionLinksComponent],
  templateUrl: './section-links-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionLinksDefaultComponent {
  protected readonly items = [
    { label: 'Studios', meta: '7 published', link: '/admin/studios' },
    { label: 'Needs re-verification', meta: '2 items are stale', link: '/admin/stale', attention: true },
  ];
}
