import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlacesService } from '../../services/places';
import { Place } from '../../models/place.model';
import { ResponsiveImageComponent } from '../responsive-image/responsive-image';

@Component({
  selector: 'app-places-list',
  imports: [CommonModule, RouterLink, ResponsiveImageComponent],
  templateUrl: './places-list.html',
  styleUrl: './places-list.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlacesList implements OnInit {
  // Inject the PlacesService
  private placesService = inject(PlacesService);
  
  // Signal to hold all places
  places = signal<Place[]>([]);
  
  // Signal to track loading state
  loading = signal(true);
  
  // Signal to track error state
  error = signal<string | null>(null);
  
  // Signal for search/filter functionality
  searchTerm = signal('');
  
  // Signal for selected category filter
  selectedCategory = signal<string>('all');

  ngOnInit(): void {
    this.loadPlaces();
  }

  /**
   * Load all places from the API
   */
  loadPlaces(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.placesService.getPlaces().subscribe({
      next: (data) => {
        this.places.set(data.places);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading places:', err);
        this.error.set('Failed to load places. Please try again later.');
        this.loading.set(false);
      }
    });
  }

  /**
   * Get unique categories from places
   */
  getCategories(): string[] {
    const categories = new Set(this.places().map(p => p.category));
    return Array.from(categories).sort();
  }

  /**
   * Filter places based on search term and category
   */
  filteredPlaces(): Place[] {
    let filtered = this.places();
    const term = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Filter by search term
    if (term) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.address.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  /**
   * Update search term
   */
  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  /**
   * Update selected category
   */
  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory.set(target.value);
  }

  /**
   * Generate URL slug from place name
   */
  getSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}
