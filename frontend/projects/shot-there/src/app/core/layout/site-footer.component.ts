import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EmailSignupComponent } from '../email-signup/email-signup.component';
import { APP_PATHS } from '../routing/app-paths';

@Component({
  selector: 'st-site-footer',
  imports: [RouterLink, EmailSignupComponent],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.css',
})
export class SiteFooterComponent {
  protected readonly studiosPath = `/${APP_PATHS.studios}`;
  protected readonly spotsPath = `/${APP_PATHS.spots}`;
  protected readonly guidesPath = `/${APP_PATHS.guides}`;
  protected readonly editorialPolicyPath = `/${APP_PATHS.editorialPolicy}`;
  protected readonly youTubeChannelUrl = 'https://www.youtube.com/@ShotThere';
  protected readonly year = new Date().getFullYear();
}
