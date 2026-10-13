import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_PATHS } from '../routing/app-paths';

@Component({
  selector: 'st-site-footer',
  imports: [RouterLink],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.css'
})
export class SiteFooterComponent {
  protected readonly studiosPath = `/${APP_PATHS.studios}`;
  protected readonly youTubeChannelUrl = 'https://www.youtube.com/@ShotThere';
  protected readonly year = new Date().getFullYear();
}
