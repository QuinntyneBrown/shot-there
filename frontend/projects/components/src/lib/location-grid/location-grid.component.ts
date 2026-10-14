import { ChangeDetectionStrategy, Component } from '@angular/core';

/** The DS location grid: one column at XS, two from SM, three from LG. Children are the application's li elements. */
@Component({
  selector: 'ul[st-location-grid]',
  templateUrl: './location-grid.component.html',
  styleUrl: './location-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'location-grid' },
})
export class LocationGridComponent {}
