import { Component, input } from '@angular/core';
import { StudioBasicsDto } from '@shot-there/api';
import { ButtonComponent, IconComponent } from '@shot-there/components';

@Component({
  selector: 'app-studio-basics',
  imports: [ButtonComponent, IconComponent],
  templateUrl: './studio-basics.component.html',
  styleUrl: './studio-basics.component.css',
})
export class StudioBasicsComponent {
  readonly basics = input.required<StudioBasicsDto>();
  protected readonly externalHint = $localize`:@@st.link.external:(opens in a new tab)`;
}
