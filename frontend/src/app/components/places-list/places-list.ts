import { Component, inject, OnInit, OnDestroy, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
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
export class PlacesList implements OnInit, OnDestroy {
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

  // Subject to handle search input with debouncing
  private searchSubject = new Subject<string>();
  
  // Subscription to manage the search debounce
  private searchSubscription?: Subscription;

  // Minimum characters required before searching (set to 3)
  private readonly MIN_SEARCH_LENGTH = 3;
  
  // Debounce time in milliseconds (set to 500ms = half a second)
  private readonly DEBOUNCE_TIME = 500;

  ngOnInit(): void {
    this.loadPlaces();
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    this.searchSubscription?.unsubscribe();
  }

  /**
   * Set up debounced search functionality
   * Only triggers search after user stops typing for 500ms
   * and only if search term has at least 3 characters (or is empty to clear)
   */
  private setupSearchDebounce(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        // Wait 500ms after user stops typing before processing
        debounceTime(this.DEBOUNCE_TIME),
        // Only process if value has changed
        distinctUntilChanged()
      )
      .subscribe(term => {
        // Only update search term if it has at least 3 characters or is empty
        // This prevents searching with less than 3 characters
        if (term.length === 0 || term.length >= this.MIN_SEARCH_LENGTH) {
          this.searchTerm.set(term);
        } else {
          // If less than 3 characters, clear the search to show all results
          this.searchTerm.set('');
        }
      });
  }

  /**
   * Load all places from the API
   */
  loadPlaces(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.placesService.getPlaces().subscribe({
      next: (places) => {
        this.places.set(places);
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
   * Flattens all categories arrays and returns unique values
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.places().forEach(place => {
      place.categories.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
  }

  /**
   * Filter places based on search term and category
   */
  filteredPlaces(): Place[] {
    let filtered = this.places();
    const term = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();

    // Filter by category - check if place's categories array includes the selected category
    if (category !== 'all') {
      filtered = filtered.filter(p => p.categories.includes(category));
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
   * Handle search input changes
   * Pushes the value to the search subject for debounced processing
   */
  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    // If the search is cleared (empty), update immediately without debounce
    if (value.length === 0) {
      this.searchTerm.set('');
      return;
    }
    
    // For non-empty values, push to subject for debounced processing
    // The debounce will wait 500ms, then only trigger search if value >= 3 characters
    // If value < 3 characters, it will clear the search to show all results
    this.searchSubject.next(value);
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
