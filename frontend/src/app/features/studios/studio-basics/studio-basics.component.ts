import { Component, input } from '@angular/core';
import { StudioBasicsDto } from '@shot-there/api';

@Component({
  selector: 'st-studio-basics',
  templateUrl: './studio-basics.component.html',
  styleUrl: './studio-basics.component.css'
})
export class StudioBasicsComponent {
  readonly basics = input.required<StudioBasicsDto>();
}
