import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI?.trim() || "";
const dbName = process.env.MONGODB_DB_NAME?.trim() || "ecoroute-ai";

function getCache() {
  if (!globalThis.__ecorouteMongoCache) {
    globalThis.__ecorouteMongoCache = {
      client: null,
      promise: null,
      failed: false,
      lastError: "",
    };
  }

  return globalThis.__ecorouteMongoCache;
}

export function hasMongoStorage() {
  return Boolean(uri);
}

export function getConfiguredStorageDriver() {
  const cache = getCache();
  return hasMongoStorage() && !cache.failed ? "mongodb" : "file";
}

export function getStorageStatus() {
  const cache = getCache();
  return {
    configuredDriver: hasMongoStorage() ? "mongodb" : "file",
    activeDriver: getConfiguredStorageDriver(),
    durable: getConfiguredStorageDriver() === "mongodb",
    fallbackActive: cache.failed,
    lastError: cache.lastError || "",
  };
}

export async function getMongoDb() {
  if (!uri) {
    throw new Error("MongoDB is not configured. Set MONGODB_URI to enable durable production storage.");
  }

  const cache = getCache();

  if (!cache.promise) {
    const client = new MongoClient(uri);
    cache.promise = client
      .connect()
      .then((connected) => {
        cache.client = connected;
        cache.failed = false;
        cache.lastError = "";
        return connected;
      })
      .catch((error) => {
        cache.promise = null;
        cache.client = null;
        cache.failed = true;
        cache.lastError = error?.message || "MongoDB connection failed.";
        throw error;
      });
  }

  const client = cache.client ?? await cache.promise;
  return client.db(dbName);
}
