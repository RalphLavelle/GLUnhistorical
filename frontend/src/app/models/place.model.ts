// Type definitions for Place data structure
export interface Place {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
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

