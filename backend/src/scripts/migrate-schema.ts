/**
 * Migration script to update the places collection schema:
 * 1. Add 'active' boolean field (defaulted to true)
 * 2. Convert 'category' string to 'categories' array
 * 
 * Run with: npx ts-node src/scripts/migrate-schema.ts
 */

import { connectToMongo, disconnectMongo } from '../db/mongo';

const PLACES_COLLECTION = 'places';

async function migrateSchema() {
  const db = await connectToMongo();
  const placesCollection = db.collection(PLACES_COLLECTION);

  console.log('Starting schema migration...');

  // Get all places that need migration
  // Find documents that either:
  // - Don't have 'active' field, OR
  // - Have 'category' field (old schema)
  const placesToMigrate = await placesCollection.find({
    $or: [
      { active: { $exists: false } },
      { category: { $exists: true } }
    ]
  }).toArray();

  console.log(`Found ${placesToMigrate.length} documents to migrate`);

  let activeUpdated = 0;
  let categoryMigrated = 0;

  for (const place of placesToMigrate) {
    const update: any = {};

    // Add 'active' field if missing, default to true
    if (place.active === undefined) {
      update.active = true;
      activeUpdated++;
    }

    // Convert 'category' to 'categories' array if it exists
    if (place.category !== undefined) {
      // If categories already exists, merge them (avoid duplicates)
      if (place.categories && Array.isArray(place.categories)) {
        // Add category to array if not already present
        if (!place.categories.includes(place.category)) {
          update.categories = [...place.categories, place.category];
        } else {
          update.categories = place.categories;
        }
      } else {
        // Create new array with single category value
        update.categories = [place.category];
      }
      // Remove old category field
      update.$unset = { category: '' };
      categoryMigrated++;
    }

    // Only update if there are changes to make
    if (Object.keys(update).length > 0) {
      // Handle $unset separately if it exists
      if (update.$unset) {
        const unsetValue = update.$unset;
        delete update.$unset;
        await placesCollection.updateOne(
          { _id: place._id },
          { $set: update, $unset: unsetValue }
        );
      } else {
        await placesCollection.updateOne(
          { _id: place._id },
          { $set: update }
        );
      }
    }
  }

  console.log(`Migration complete:`);
  console.log(`  - Added 'active' field to ${activeUpdated} documents`);
  console.log(`  - Migrated 'category' to 'categories' for ${categoryMigrated} documents`);
  console.log(`Total documents processed: ${placesToMigrate.length}`);
}

// Run migration
migrateSchema()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await disconnectMongo();
    } catch (error) {
      // Ignore disconnect errors
    }
  });
