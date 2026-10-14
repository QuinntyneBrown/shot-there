import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TagListComponent } from '@shot-there/components';

/** A static tag list named Best uses and a list of tag links. */
@Component({
  selector: 'st-tag-list-states',
  imports: [TagListComponent],
  templateUrl: './tag-list-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListStatesComponent {
  protected readonly uses = [{ label: 'Engagement' }, { label: 'Family' }, { label: 'Portrait' }];
  protected readonly links = [
    { label: 'Best studios under $120 for 2 hours', link: '/guides/best-studios-under-120' },
    { label: 'Best natural light', link: '/guides/best-natural-light' },
  ];
}
