import { Collection, Db } from 'mongodb';
import { CreateBookingInput, Booking } from '../types/api';

const BOOKINGS_COLLECTION = 'bookings';

function getBookingsCollection(db: Db): Collection<Booking> {
  return db.collection<Booking>(BOOKINGS_COLLECTION);
}

export async function ensureTouristsIndexes(db: Db): Promise<void> {
  await getBookingsCollection(db).createIndex({ id: 1 }, { unique: true });
  await getBookingsCollection(db).createIndex({ createdAt: 1 });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function parsePartySize(value: number | string): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.trunc(value) : null;
  if (typeof value !== 'string') return null;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function generateBookingId(): string {
  // Keep the same "booking-..." style as the existing implementation
  // so existing data and expectations remain consistent.
  const rand = Math.random().toString(36).slice(2, 11);
  return `booking-${Date.now()}-${rand}`;
}

export function validateCreateBookingInput(input: unknown): {
  ok: true;
  value: CreateBookingInput;
} | {
  ok: false;
  error: string;
} {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, error: 'Invalid request body' };
  }

  const body = input as Record<string, unknown>;
  const name = body['name'];
  const email = body['email'];
  const partySize = body['partySize'];
  const preferredDate = body['preferredDate'];

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(preferredDate)) {
    return { ok: false, error: 'Missing required fields' };
  }

  const parsedPartySize = parsePartySize(
    typeof partySize === 'number' || typeof partySize === 'string' ? partySize : ''
  );

  if (!parsedPartySize || parsedPartySize <= 0) {
    return { ok: false, error: 'partySize must be a positive integer' };
  }

  return {
    ok: true,
    value: {
      name: name.trim(),
      email: email.trim(),
      partySize: parsedPartySize,
      preferredDate: preferredDate.trim(),
    },
  };
}

export async function createBooking(db: Db, input: CreateBookingInput): Promise<Booking> {
  const booking: Booking = {
    id: generateBookingId(),
    name: input.name,
    email: input.email,
    partySize: parsePartySize(input.partySize) ?? 0,
    preferredDate: input.preferredDate,
    createdAt: new Date().toISOString(),
  };

  // partySize has already been validated; this is defensive.
  if (!booking.partySize || booking.partySize <= 0) {
    throw new Error('Invalid partySize after validation.');
  }

  await getBookingsCollection(db).insertOne(booking);
  return booking;
}

export async function upsertTouristBookings(
  db: Db,
  bookings: Booking[]
): Promise<{ bookingsUpserted: number }> {
  const col = getBookingsCollection(db);
  let upserted = 0;

  for (const booking of bookings) {
    const result = await col.updateOne({ id: booking.id }, { $set: booking }, { upsert: true });
    if (result.upsertedCount === 1) upserted += 1;
  }

  return { bookingsUpserted: upserted };
}
