import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { PlacesService } from '../../services/places';
import { Place } from '../../models/place.model';
import { ResponsiveImageComponent } from '../responsive-image/responsive-image';

@Component({
  selector: 'app-place-detail',
  imports: [CommonModule, RouterLink, GoogleMapsModule, ResponsiveImageComponent],
  templateUrl: './place-detail.html',
  styleUrl: './place-detail.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceDetail implements OnInit {
  // Inject services
  private placesService = inject(PlacesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  // Signal to hold the current place
  place = signal<Place | null>(null);
  
  // Signal to track loading state
  loading = signal(true);
  
  // Signal to track error state
  error = signal<string | null>(null);

  // Map options for this place
  mapOptions: google.maps.MapOptions = {
    zoom: 16,
    mapTypeId: 'roadmap',
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: true,
    fullscreenControl: true
  };

  // Map center (will be set from place coordinates)
  mapCenter = signal({ lat: -28.00200, lng: 153.42900 });

  // Marker options for this place
  marker = signal<google.maps.MarkerOptions | null>(null);

  ngOnInit(): void {
    // Get the place ID from route parameters
    this.route.params.subscribe(params => {
      const placeId = params['id'];
      if (placeId) {
        this.loadPlace(placeId);
      } else {
        this.error.set('Invalid place ID');
        this.loading.set(false);
      }
    });
  }

  /**
   * Load a single place by ID
   */
  private loadPlace(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.placesService.getPlaceById(id).subscribe({
      next: (place) => {
        this.place.set(place);
        
        // Update map center and marker
        this.mapCenter.set({
          lat: place.latitude,
          lng: place.longitude
        });
        
        this.marker.set({
          position: { lat: place.latitude, lng: place.longitude },
          title: place.name,
          label: {
            text: place.name,
            color: '#333',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        });
        
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading place:', err);
        this.error.set('Place not found or failed to load.');
        this.loading.set(false);
      }
    });
  }
}
