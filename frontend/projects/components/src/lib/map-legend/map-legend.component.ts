import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The DS map legend: a square for studios and a ring for spots, so shape carries the type. */
@Component({
  selector: 'st-map-legend',
  templateUrl: './map-legend.component.html',
  styleUrl: './map-legend.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.map-legend--overlay]': 'overlay()' },
})
export class MapLegendComponent {
  readonly studioLabel = input.required<string>();
  readonly spotLabel = input.required<string>();
  readonly overlay = input(false, { transform: booleanAttribute });
  readonly label = input($localize`:@@st.mapLegend.label:Legend`);
}
