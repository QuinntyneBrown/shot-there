import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The DS map-unavailable notice: shown in place of the map, announced politely, with actions projected below. */
@Component({
  selector: 'st-map-unavailable',
  templateUrl: './map-unavailable.component.html',
  styleUrl: './map-unavailable.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'map-unavailable', role: 'status', '[attr.title]': 'null' },
})
export class MapUnavailableComponent {
  readonly title = input.required<string>();
  readonly text = input<string | null>(null);
}
