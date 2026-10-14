import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MapPopupComponent, MapLegendComponent, MapUnavailableComponent, ButtonComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/** A map popup, an overlay legend and the unavailable notice. */
@Component({
  selector: 'st-map-popup-states',
  imports: [MapPopupComponent, MapLegendComponent, MapUnavailableComponent, ButtonComponent, ActivationLogComponent],
  templateUrl: './map-popup-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPopupStatesComponent {
  protected readonly log = signal<readonly string[]>([]);
}
