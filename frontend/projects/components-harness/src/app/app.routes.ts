import { Routes } from '@angular/router';
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
];
