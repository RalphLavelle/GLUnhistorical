import * as fs from 'fs';
import * as path from 'path';
import { connectToMongo, disconnectMongo } from '../db/mongo';
import { ensurePlacesIndexes, upsertPlacesAndMetadata } from '../repositories/places.repo';
import { ensureTouristsIndexes, upsertTouristBookings } from '../repositories/tourists.repo';
import { PlacesResponse, TouristBooking } from '../types/api';

function readJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function getDataDirPath(): string {
  // Works in both:
  // - dev (src/scripts -> backend/data)
  // - built (dist/scripts -> backend/data)
  return path.join(__dirname, '..', '..', 'data');
}

async function main(): Promise<void> {
  const db = await connectToMongo();

  // Ensure indexes exist before upserting (prevents duplicates).
  await Promise.all([ensurePlacesIndexes(db), ensureTouristsIndexes(db)]);

  const dataDir = getDataDirPath();
  const placesPath = path.join(dataDir, 'places.json');
  const touristsPath = path.join(dataDir, 'tourists.json');

  if (!fs.existsSync(placesPath)) {
    throw new Error(`Missing places seed file: ${placesPath}`);
  }

  const places = readJsonFile<PlacesResponse>(placesPath);
  const tourists = fs.existsSync(touristsPath) ? readJsonFile<TouristBooking[]>(touristsPath) : [];

  const [{ placesUpserted, metadataUpserted }, { bookingsUpserted }] = await Promise.all([
    upsertPlacesAndMetadata(db, places),
    upsertTouristBookings(db, tourists),
  ]);

  // Keep output concise but useful for first-time setup.
  console.log(
    JSON.stringify(
      {
        ok: true,
        placesUpserted,
        metadataUpserted,
        bookingsUpserted,
      },
      null,
      2
    )
  );
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await disconnectMongo();
    } catch {
      // ignore
    }
  });



