import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import localeEnCa from '@angular/common/locales/en-CA';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { TitleStrategy, provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  CompareService,
  HttpCompareService,
  HttpStudioService,
  HttpStudiosService,
  HttpSubscriberService,
  StudioService,
  StudiosService,
  SubscriberService,
} from '@shot-there/api';

import { routes } from './app.routes';
import { ShotThereTitleStrategy } from './core/routing/shot-there-title-strategy';

registerLocaleData(localeEnCa);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'en-CA' },
    provideRouter(routes),
    { provide: TitleStrategy, useClass: ShotThereTitleStrategy },
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    { provide: StudiosService, useClass: HttpStudiosService },
    { provide: StudioService, useClass: HttpStudioService },
    { provide: CompareService, useClass: HttpCompareService },
    { provide: SubscriberService, useClass: HttpSubscriberService },
  ],
};
