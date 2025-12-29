import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tourist } from '../models/tourist.model';

@Injectable({
  providedIn: 'root',
})
export class TouristService {
  // Inject HttpClient using inject() function (Angular best practice)
  private http = inject(HttpClient);
  
  // API base URL - using relative path (proxy handles forwarding to backend)
  private apiUrl = '/api';

  /**
   * Submit a tour booking
   * @param tourist - The tourist booking data to submit
   * Returns an Observable that emits the saved booking with server-generated ID
   */
  submitBooking(tourist: Tourist): Observable<Tourist> {
    return this.http.post<Tourist>(`${this.apiUrl}/tourists`, tourist);
  }
}

