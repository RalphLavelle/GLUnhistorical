import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';

/**
 * Service to dynamically load Google Maps API script
 * This allows us to use environment variables instead of hardcoding the API key
 */
@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoader {
  private document = inject(DOCUMENT);
  private loaded = false;
  private loading = false;

  /**
   * Load Google Maps API script dynamically
   * Returns a promise that resolves when the script is loaded
   */
  load(): Promise<void> {
    // If already loaded, resolve immediately
    if (this.loaded) {
      return Promise.resolve();
    }

    // If currently loading, return the existing promise
    if (this.loading) {
      return new Promise((resolve) => {
        const checkLoaded = setInterval(() => {
          if (this.loaded) {
            clearInterval(checkLoaded);
            resolve();
          }
        }, 100);
      });
    }

    this.loading = true;

    return new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = this.document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        this.loaded = true;
        this.loading = false;
        resolve();
        return;
      }

      // Get API key from environment
      const apiKey = environment.googleMapsApiKey || (this.document.defaultView as any)?.GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
        console.warn('Google Maps API key not configured. Maps will not work.');
        this.loading = false;
        resolve(); // Resolve anyway to not block app initialization
        return;
      }

      // Create script element
      const script = this.document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.loaded = true;
        this.loading = false;
        resolve();
      };
      
      script.onerror = () => {
        this.loading = false;
        console.error('Failed to load Google Maps API');
        reject(new Error('Failed to load Google Maps API'));
      };

      // Append to head
      this.document.head.appendChild(script);
    });
  }
}

