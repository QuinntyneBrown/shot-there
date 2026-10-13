import { Routes } from '@angular/router';
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
];
