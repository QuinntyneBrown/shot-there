import { Component, computed, input } from '@angular/core';
import { StudioDisclosureDto } from '@shot-there/api';

import { disclosureMessage } from './studio-disclosure.view-model';

@Component({
  selector: 'st-studio-disclosure',
  templateUrl: './studio-disclosure.component.html',
  styleUrl: './studio-disclosure.component.css'
})
export class StudioDisclosureComponent {
  readonly disclosure = input.required<StudioDisclosureDto>();
  protected readonly message = computed(() => disclosureMessage(this.disclosure()));
}
