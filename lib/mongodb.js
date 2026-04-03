import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI?.trim() || "";
const dbName = process.env.MONGODB_DB_NAME?.trim() || "ecoroute-ai";

function getCache() {
  if (!globalThis.__ecorouteMongoCache) {
    globalThis.__ecorouteMongoCache = {
      client: null,
      promise: null,
    };
  }

  return globalThis.__ecorouteMongoCache;
}

export function hasMongoStorage() {
  return Boolean(uri);
}

export function getConfiguredStorageDriver() {
  return hasMongoStorage() ? "mongodb" : "file";
}

export async function getMongoDb() {
  if (!uri) {
    throw new Error("MongoDB is not configured. Set MONGODB_URI to enable durable production storage.");
  }

  const cache = getCache();

  if (!cache.promise) {
    const client = new MongoClient(uri);
    cache.promise = client.connect().then((connected) => {
      cache.client = connected;
      return connected;
    });
  }

  const client = cache.client ?? await cache.promise;
  return client.db(dbName);
}
