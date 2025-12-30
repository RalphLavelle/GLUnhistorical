import { Collection, Db } from 'mongodb';
import { Place } from '../types/api';

const PLACES_COLLECTION = 'places';

function getPlacesCollection(db: Db): Collection<Place> {
  return db.collection<Place>(PLACES_COLLECTION);
}

export async function ensurePlacesIndexes(db: Db): Promise<void> {
  await getPlacesCollection(db).createIndex({ id: 1 }, { unique: true });
  // Note: MongoDB automatically creates a unique index on `_id` for every collection,
  // so we don't need (and cannot specify) `unique: true` for an `_id` index.
}

/**
 * Retrieves all places from the MongoDB places collection.
 * 
 * @param db - MongoDB database instance
 * @returns Array of places sorted by name
 */
export async function getPlaces(db: Db): Promise<Place[]> {
  return getPlacesCollection(db).find({}).sort({ name: 1 }).toArray();
}

export async function getPlaceById(db: Db, id: string): Promise<Place | null> {
  return getPlacesCollection(db).findOne({ id });
}

/**
 * Upserts places into the MongoDB places collection.
 * 
 * @param db - MongoDB database instance
 * @param places - Array of places to upsert
 * @returns Number of places that were newly inserted (not updated)
 */
export async function upsertPlaces(
  db: Db,
  places: Place[]
): Promise<{ placesUpserted: number }> {
  const placesCol = getPlacesCollection(db);

  let upserted = 0;
  for (const place of places) {
    const result = await placesCol.updateOne({ id: place.id }, { $set: place }, { upsert: true });
    if (result.upsertedCount === 1) upserted += 1;
  }

  return { placesUpserted: upserted };
}


