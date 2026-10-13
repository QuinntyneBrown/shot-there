import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_PATHS } from '../../core/routing/app-paths';

@Component({
  selector: 'st-not-found-page',
  imports: [RouterLink],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.css'
})
export class NotFoundPageComponent {
  protected readonly homePath = `/${APP_PATHS.home}`;
  protected readonly studiosPath = `/${APP_PATHS.studios}`;
}
