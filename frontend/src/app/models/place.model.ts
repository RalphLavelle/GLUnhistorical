// Type definitions for Place data structure
export interface Place {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  categories: string[];  // Changed from category: string to support multiple categories
  address: string;
  active: boolean;       // New field for soft-delete functionality
}

/**
 * Metadata about the tour, loaded from frontend assets
 */
export interface PlacesMetadata {
  version: string;
  lastUpdated: string;
  tourDuration: string;
  tourDistance: string;
  region: string;
  coordinates: {
    centerLat: number;
    centerLng: number;
  };
}

