import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideCloudinaryLoader } from '@angular/common';

import { routes } from './app.routes';
import { GoogleMapsLoader } from './config/google-maps-loader';
import { environment } from '../environments/environment';

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
    // Configure Cloudinary image loader for NgOptimizedImage
    // Uses cloud name from environment to build image URLs
    provideCloudinaryLoader(`https://res.cloudinary.com/${environment.cloudinary.cloudName}`),
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
