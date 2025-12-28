import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { PlacesService } from '../../services/places';
import { Place, PlacesResponse } from '../../models/place.model';
import { ResponsiveImageComponent } from '../responsive-image/responsive-image';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, GoogleMapsModule, ResponsiveImageComponent],
  templateUrl: './home.html',
  styleUrl: './home.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit {
  // Inject the PlacesService using inject() function
  private placesService = inject(PlacesService);
  
  // Signal to hold all places data
  placesData = signal<PlacesResponse | null>(null);
  
  // Signal to hold individual places array
  places = signal<Place[]>([]);
  
  // Center coordinates for the map (from metadata)
  mapCenter = signal({ lat: -28.00200, lng: 153.42900 });
  
  // Map options - center is set via [center] binding in template
  mapOptions: google.maps.MapOptions = {
    zoom: 14,
    mapTypeId: 'roadmap',
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true
  };

  // Marker options for all places
  markers = signal<google.maps.MarkerOptions[]>([]);

  ngOnInit(): void {
    // Load places data when component initializes
    this.loadPlaces();
  }

  /**
   * Load all places from the API and prepare map markers
   */
  private loadPlaces(): void {
    this.placesService.getPlaces().subscribe({
      next: (data) => {
        // Update signals with the received data
        this.placesData.set(data);
        this.places.set(data.places);
        
        // Update map center from metadata
        this.mapCenter.set({
          lat: data.metadata.coordinates.centerLat,
          lng: data.metadata.coordinates.centerLng
        });
        
        // Create markers for each place
        const markerOptions: google.maps.MarkerOptions[] = data.places.map(place => ({
          position: { lat: place.latitude, lng: place.longitude },
          title: place.name,
          label: {
            text: place.name,
            color: '#333',
            fontSize: '12px'
          }
        }));
        
        this.markers.set(markerOptions);
      },
      error: (error) => {
        console.error('Error loading places:', error);
      }
    });
  }
}
