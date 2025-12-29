import { Collection, Db } from 'mongodb';
import { Place, PlacesMetadata, PlacesResponse } from '../types/api';

const PLACES_COLLECTION = 'places';
const METADATA_COLLECTION = 'placesMetadata';
const METADATA_ID = 'default';

type PlacesMetadataDoc = PlacesMetadata & { _id: string };

function getPlacesCollection(db: Db): Collection<Place> {
  return db.collection<Place>(PLACES_COLLECTION);
}

function getMetadataCollection(db: Db): Collection<PlacesMetadataDoc> {
  return db.collection<PlacesMetadataDoc>(METADATA_COLLECTION);
}

export async function ensurePlacesIndexes(db: Db): Promise<void> {
  await getPlacesCollection(db).createIndex({ id: 1 }, { unique: true });
  // Note: MongoDB automatically creates a unique index on `_id` for every collection,
  // so we don't need (and cannot specify) `unique: true` for an `_id` index.
}

export async function getPlacesResponse(db: Db): Promise<PlacesResponse> {
  const [places, metadataDoc] = await Promise.all([
    getPlacesCollection(db).find({}).sort({ name: 1 }).toArray(),
    getMetadataCollection(db).findOne({ _id: METADATA_ID }),
  ]);

  if (!metadataDoc) {
    // When running before seeding, be explicit and actionable.
    throw new Error(
      'Places metadata not found in MongoDB. Run `npm run seed` in the backend to import initial data.'
    );
  }

  const { _id: _ignored, ...metadata } = metadataDoc;
  return { places, metadata };
}

export async function getPlaceById(db: Db, id: string): Promise<Place | null> {
  return getPlacesCollection(db).findOne({ id });
}

export async function upsertPlacesAndMetadata(
  db: Db,
  data: PlacesResponse
): Promise<{ placesUpserted: number; metadataUpserted: boolean }> {
  const placesCol = getPlacesCollection(db);
  const metaCol = getMetadataCollection(db);

  // Upsert places (idempotent seed behavior).
  let upserted = 0;
  for (const place of data.places) {
    const result = await placesCol.updateOne({ id: place.id }, { $set: place }, { upsert: true });
    if (result.upsertedCount === 1) upserted += 1;
  }

  const metaResult = await metaCol.updateOne(
    { _id: METADATA_ID },
    { $set: { ...data.metadata, _id: METADATA_ID } },
    { upsert: true }
  );

  return { placesUpserted: upserted, metadataUpserted: metaResult.upsertedCount === 1 };
}


