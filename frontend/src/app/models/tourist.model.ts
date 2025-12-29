/**
 * Tourist booking model
 * Represents a tour booking submission
 */
export interface Tourist {
  /** Unique identifier for the booking */
  id?: string;
  /** Full name of the person booking the tour */
  name: string;
  /** Email address for contact */
  email: string;
  /** Number of people in the party */
  partySize: number;
  /** Preferred date for the tour */
  preferredDate: string;
  /** Timestamp when the booking was created */
  createdAt?: string;
}




