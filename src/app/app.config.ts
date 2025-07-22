import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideHttpClient(), provideAnimationsAsync()
  ]
};

export const appSettings = {
   apiBaseUrl : 'https://ds-projeto-back.onrender.com'
   //apiBaseUrl : 'http://localhost:8080'
};
