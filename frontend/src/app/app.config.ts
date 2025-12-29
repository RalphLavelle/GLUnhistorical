import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { GoogleMapsLoader } from './config/google-maps-loader';

/**
 * Initialize Google Maps API before app starts
 */
function initializeGoogleMaps(loader: GoogleMapsLoader): () => Promise<void> {
  return () => loader.load();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Provide HttpClient for API calls
    provideHttpClient(),
    // Load Google Maps API dynamically using environment variable
    GoogleMapsLoader,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeGoogleMaps,
      deps: [GoogleMapsLoader],
      multi: true
    }
  ]
};
