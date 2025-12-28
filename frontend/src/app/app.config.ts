import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Provide HttpClient for API calls
    provideHttpClient()
    // Note: Google Maps is configured via the script tag in index.html
    // Components import GoogleMapsModule directly where needed
  ]
};
