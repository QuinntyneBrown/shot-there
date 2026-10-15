import { Component } from '@angular/core';
import { PageHeaderComponent } from '@shot-there/components';

/** The editorial policy (L2-046): fixed text, no API call. */
@Component({
  selector: 'app-editorial-policy-page',
  imports: [PageHeaderComponent],
  templateUrl: './editorial-policy-page.component.html',
  styleUrl: './editorial-policy-page.component.css',
})
export class EditorialPolicyPageComponent {}
