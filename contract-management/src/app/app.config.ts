import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from './core/auth/auth.service';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

registerLocaleData(localePt);

function initializeKeycloak(keycloak: KeycloakService, authService: AuthService) {
  return async () => {
    if (environment.keycloak.enabled) {
      try {
        await keycloak.init({
          config: {
            url: environment.keycloak.url,
            realm: environment.keycloak.realm,
            clientId: environment.keycloak.clientId
          },
          initOptions: {
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
            checkLoginIframe: false
          },
          enableBearerInterceptor: true,
          bearerPrefix: 'Bearer'
        });
      } catch (e) {
        console.warn('Keycloak initialization failed, falling back to demo mode:', e);
      }
    }
    await authService.initFromKeycloak();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'pt-PT' },
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, AuthService]
    }
  ]
};
