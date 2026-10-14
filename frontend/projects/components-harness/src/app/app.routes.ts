import { Routes } from '@angular/router';
import { SegmentedDefaultComponent } from './segmented/segmented-default.component';
import { FilterTriggerStatesComponent } from './filter-trigger/filter-trigger-states.component';
import { LinkVariantsComponent } from './link/link-variants.component';
import { IconButtonPressedComponent } from './icon-button/icon-button-pressed.component';
import { IconButtonDefaultComponent } from './icon-button/icon-button-default.component';
import { ButtonPressedComponent } from './button/button-pressed.component';
import { ButtonSoftDisabledComponent } from './button/button-soft-disabled.component';
import { ButtonBusyComponent } from './button/button-busy.component';
import { ButtonLinkComponent } from './button/button-link.component';
import { ButtonBlockComponent } from './button/button-block.component';
import { ButtonSizesComponent } from './button/button-sizes.component';
import { ButtonVariantsComponent } from './button/button-variants.component';
import { FallbackImageBrokenComponent } from './fallback-image/fallback-image-broken.component';
import { HarnessIndexComponent } from './harness-index/harness-index.component';
import { IconSheetComponent } from './icon/icon-sheet.component';
import { IconSizesComponent } from './icon/icon-sizes.component';

/** One route per component state, named <component>/<state>. */
export const routes: Routes = [
  { path: '', component: HarnessIndexComponent },
  { path: 'fallback-image/broken', component: FallbackImageBrokenComponent },
  { path: 'icon/sheet', component: IconSheetComponent },
  { path: 'icon/sizes', component: IconSizesComponent },
  { path: 'button/variants', component: ButtonVariantsComponent },
  { path: 'button/sizes', component: ButtonSizesComponent },
  { path: 'button/block', component: ButtonBlockComponent },
  { path: 'button/link', component: ButtonLinkComponent },
  { path: 'button/busy', component: ButtonBusyComponent },
  { path: 'button/soft-disabled', component: ButtonSoftDisabledComponent },
  { path: 'button/pressed', component: ButtonPressedComponent },
  { path: 'icon-button/default', component: IconButtonDefaultComponent },
  { path: 'icon-button/pressed', component: IconButtonPressedComponent },
  { path: 'link/variants', component: LinkVariantsComponent },
  { path: 'filter-trigger/states', component: FilterTriggerStatesComponent },
  { path: 'segmented/default', component: SegmentedDefaultComponent },
];
