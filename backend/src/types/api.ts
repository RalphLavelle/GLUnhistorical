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

export interface PlacesResponse {
  places: Place[];
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  partySize: number;
  preferredDate: string;
  createdAt: string;
}

export interface CreateBookingInput {
  name: string;
  email: string;
  partySize: number | string;
  preferredDate: string;
}
