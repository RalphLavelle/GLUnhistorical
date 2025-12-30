import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { forkJoin } from 'rxjs';
import { PlacesService } from '../../services/places';
import { MetadataService } from '../../services/metadata';
import { Place } from '../../models/place.model';
import { ResponsiveImageComponent } from '../responsive-image/responsive-image';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, GoogleMapsModule, ResponsiveImageComponent],
  templateUrl: './home.html',
  styleUrl: './home.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit {
  // Inject services using inject() function
  private placesService = inject(PlacesService);
  private metadataService = inject(MetadataService);
  
  // Signal to hold places array
  places = signal<Place[]>([]);
  
  // Center coordinates for the map (from metadata)
  mapCenter = signal({ lat: -28.00200, lng: 153.42900 });
  
  // Map options - center is set via [center] binding in template
  mapOptions: google.maps.MapOptions = {
    zoom: 16,
    mapTypeId: 'roadmap',
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true
  };

  // Marker options for all places
  markers = signal<google.maps.MarkerOptions[]>([]);

  ngOnInit(): void {
    // Load places and metadata data when component initializes
    this.loadPlacesAndMetadata();
  }

  /**
   * Load all places from the API and metadata from assets in parallel
   */
  private loadPlacesAndMetadata(): void {
    // Load places and metadata in parallel using forkJoin
    forkJoin({
      places: this.placesService.getPlaces(),
      metadata: this.metadataService.getMetadata(),
    }).subscribe({
      next: ({ places, metadata }) => {
        // Update signals with the received data
        this.places.set(places);
        
        // Update map center from metadata
        this.mapCenter.set({
          lat: metadata.coordinates.centerLat,
          lng: metadata.coordinates.centerLng,
        });
        
        // Create markers for each place
        const markerOptions: google.maps.MarkerOptions[] = places.map(place => ({
          position: { lat: place.latitude, lng: place.longitude },
          title: place.name,
          label: {
            text: place.name,
            color: '#333',
            fontSize: '12px',
          },
        }));
        
        this.markers.set(markerOptions);
      },
      error: (error) => {
        console.error('Error loading places or metadata:', error);
      },
    });
  }
}
