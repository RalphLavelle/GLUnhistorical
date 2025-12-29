/**
 * Shared API types for the backend.
 *
 * These are mirrored from the frontend models so we can keep the API contract
 * stable while changing the persistence layer (JSON files -> MongoDB).
 */

export type PlaceId = string;

export interface Place {
  id: PlaceId;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
}

export interface PlacesMetadata {
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
}

export interface PlacesResponse {
  places: Place[];
  metadata: PlacesMetadata;
}

export interface TouristBooking {
  id: string;
  name: string;
  email: string;
  partySize: number;
  preferredDate: string;
  createdAt: string;
}

export interface CreateTouristBookingInput {
  name: string;
  email: string;
  partySize: number | string;
  preferredDate: string;
}



