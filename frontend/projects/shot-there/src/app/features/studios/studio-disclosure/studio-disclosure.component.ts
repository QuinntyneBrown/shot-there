import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudioDisclosureDto } from '@shot-there/api';
import { IconComponent } from '@shot-there/components';

import { APP_PATHS } from '../../../core/routing/app-paths';
import { disclosureMessage } from './studio-disclosure.view-model';

@Component({
  selector: 'st-studio-disclosure',
  imports: [RouterLink, IconComponent],
  templateUrl: './studio-disclosure.component.html',
  styleUrl: './studio-disclosure.component.css',
})
export class StudioDisclosureComponent {
  readonly disclosure = input.required<StudioDisclosureDto>();
  protected readonly editorialPolicyPath = `/${APP_PATHS.editorialPolicy}`;
  protected readonly message = computed(() => disclosureMessage(this.disclosure()));
}
