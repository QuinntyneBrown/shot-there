import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent, ErrorPageComponent } from '@shot-there/components';
import { APP_PATHS } from '../../core/routing/app-paths';

@Component({
  selector: 'st-not-found-page',
  imports: [ButtonComponent, ErrorPageComponent, RouterLink],
  templateUrl: './not-found-page.component.html',
})
export class NotFoundPageComponent {
  protected readonly homePath = `/${APP_PATHS.home}`;
  protected readonly studiosPath = `/${APP_PATHS.studios}`;
}
