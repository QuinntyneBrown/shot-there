import { Routes } from '@angular/router';
import { FallbackImageBrokenComponent } from './fallback-image/fallback-image-broken.component';
import { HarnessIndexComponent } from './harness-index/harness-index.component';

/** One route per component state, named <component>/<state>. */
export const routes: Routes = [
  { path: '', component: HarnessIndexComponent },
  { path: 'fallback-image/broken', component: FallbackImageBrokenComponent },
];
