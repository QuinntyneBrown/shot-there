import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudioDisclosureDto } from '@shot-there/api';
import { DisclosureComponent } from '@shot-there/components';

import { APP_PATHS } from '../../../core/routing/app-paths';
import { disclosureMessage } from './studio-disclosure.view-model';

@Component({
  selector: 'st-studio-disclosure',
  imports: [RouterLink, DisclosureComponent],
  templateUrl: './studio-disclosure.component.html',
})
export class StudioDisclosureComponent {
  readonly disclosure = input.required<StudioDisclosureDto>();
  protected readonly editorialPolicyPath = `/${APP_PATHS.editorialPolicy}`;
  protected readonly message = computed(() => disclosureMessage(this.disclosure()));
}
