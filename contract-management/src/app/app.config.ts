import { ApplicationConfig, provideAppInitializer, inject, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {
  provideKeycloak,
  includeBearerTokenInterceptor,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  withAutoRefreshToken,
  AutoRefreshTokenService,
  UserActivityService,
  type IncludeBearerTokenCondition,
} from 'keycloak-angular';
import { AuthService } from './core/auth/auth.service';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

registerLocaleData(localePt);

// Only attach bearer token to requests going to the edoclink API
const edoclinkCondition: IncludeBearerTokenCondition = {
  urlPattern: new RegExp(
    `^${environment.edoclink.apiUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
    'i'
  ),
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-PT' },

    // Register the Keycloak instance (no initOptions — we call init() ourselves in AuthService.init())
    ...(environment.keycloak.enabled
      ? [
          provideKeycloak({
            config: {
              url: environment.keycloak.url,
              realm: environment.keycloak.realm,
              clientId: environment.keycloak.clientId,
            },
            features: [
              withAutoRefreshToken({
                onInactivityTimeout: 'logout',
                sessionTimeout: 60000,
              }),
            ],
          }),
          AutoRefreshTokenService,
          UserActivityService,
          {
            provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
            useValue: [edoclinkCondition],
          },
        ]
      : []),

    // Single app initializer: init Keycloak AND populate AuthService user signal in sequence.
    // By calling kc.init() here (not in provideKeycloak), we guarantee the order is correct.
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.init();
    }),
  ],
};
