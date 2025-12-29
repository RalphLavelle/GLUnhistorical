import { Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';

/**
 * Load local environment variables (if present).
 *
 * In production, your cloud host should provide real environment variables.
 * Calling dotenv in production is harmless (it just won't find a file).
 */
dotenv.config();

let client: MongoClient | null = null;
let db: Db | null = null;

function getRequiredMongoUri(): string {
  const fromEnv = process.env.MONGODB_URI?.trim();
  if (fromEnv) return fromEnv;

  // Friendly default for local development, but require env vars in production.
  if (process.env.NODE_ENV !== 'production') return 'mongodb://localhost:27017';

  throw new Error('Missing required environment variable: MONGODB_URI');
}

function getDbName(): string {
  return (process.env.MONGODB_DB_NAME?.trim() || 'gcobscura');
}

export async function connectToMongo(): Promise<Db> {
  if (db) return db;

  const uri = getRequiredMongoUri();
  client = new MongoClient(uri);
  await client.connect();

  db = client.db(getDbName());
  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new Error('MongoDB has not been connected yet. Call connectToMongo() first.');
  }
  return db;
}

export async function disconnectMongo(): Promise<void> {
  if (!client) return;
  await client.close();
  client = null;
  db = null;
}



