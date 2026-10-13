import { Component, inject, input, output } from '@angular/core';

import { AnnouncerService } from '../../../core/a11y/announcer.service';
import { StudioSort } from '../studio-list-page/studio-sort';
import { STUDIO_SORT_OPTIONS } from './studio-sort-options';

@Component({
  selector: 'st-studio-sort-control',
  templateUrl: './studio-sort-control.component.html',
  styleUrl: './studio-sort-control.component.css'
})
export class StudioSortControlComponent {
  private readonly announcer = inject(AnnouncerService);
  readonly sort = input.required<StudioSort>();
  readonly sortChange = output<StudioSort>();
  protected readonly options = STUDIO_SORT_OPTIONS;

  choose(value: string): void {
    const option = this.options.find((o) => o.value === value);
    if (option) {
      this.sortChange.emit(option.value);
      this.announcer.announcePolite(option.announcement);
    }
  }
}
