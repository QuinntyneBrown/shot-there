import { registerLocaleData } from '@angular/common';
import localeEnCa from '@angular/common/locales/en-CA';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { TitleStrategy, provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { ShotThereTitleStrategy } from './core/routing/shot-there-title-strategy';

registerLocaleData(localeEnCa);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'en-CA' },
    provideRouter(routes),
    { provide: TitleStrategy, useClass: ShotThereTitleStrategy },
    provideClientHydration(withEventReplay())
  ]
};
