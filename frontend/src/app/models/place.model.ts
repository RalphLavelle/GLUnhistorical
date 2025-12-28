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

export interface PlacesResponse {
  places: Place[];
  metadata: {
    version: string;
    lastUpdated: string;
    totalPlaces: number;
    tourDuration: string;
    tourDistance: string;
    region: string;
    coordinates: {
      centerLat: number;
      centerLng: number;
    };
  };
}

