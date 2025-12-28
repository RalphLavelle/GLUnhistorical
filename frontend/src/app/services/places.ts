import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Place, PlacesResponse } from '../models/place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  // Inject HttpClient using inject() function (Angular best practice)
  private http = inject(HttpClient);
  
  // API base URL - using relative path (proxy handles forwarding to backend)
  private apiUrl = '/api';

  /**
   * Fetch all places from the API
   * Returns an Observable that emits the full places response including metadata
   */
  getPlaces(): Observable<PlacesResponse> {
    return this.http.get<PlacesResponse>(`${this.apiUrl}/places`);
  }

  /**
   * Fetch a single place by its ID
   * @param id - The unique identifier of the place
   * Returns an Observable that emits the place data
   */
  getPlaceById(id: string): Observable<Place> {
    return this.http.get<Place>(`${this.apiUrl}/places/${id}`);
  }
}
