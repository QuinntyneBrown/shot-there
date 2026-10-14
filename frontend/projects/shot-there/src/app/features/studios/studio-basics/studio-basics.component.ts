import { Component, input } from '@angular/core';
import { StudioBasicsDto } from '@shot-there/api';
import { IconComponent } from '@shot-there/components';

@Component({
  selector: 'st-studio-basics',
  imports: [IconComponent],
  templateUrl: './studio-basics.component.html',
  styleUrl: './studio-basics.component.css',
})
export class StudioBasicsComponent {
  readonly basics = input.required<StudioBasicsDto>();
}
