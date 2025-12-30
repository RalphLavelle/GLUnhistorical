import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlacesMetadata } from '../models/place.model';

/**
 * Service for loading tour metadata from the frontend assets folder.
 * 
 * Metadata contains static configuration information about the tour,
 * such as version, tour duration, distance, region, and map coordinates.
 * This data is loaded directly from the frontend assets, eliminating
 * the need for a backend API call for static information.
 */
@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  // Inject HttpClient using inject() function (Angular best practice)
  private http = inject(HttpClient);

  /**
   * Fetch metadata from the public folder
   * @returns Observable that emits the metadata object
   */
  getMetadata(): Observable<PlacesMetadata> {
    return this.http.get<PlacesMetadata>('/metadata.json');
  }
}

