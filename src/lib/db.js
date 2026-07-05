import { MongoClient } from "mongodb";

const DB_NAME = "ccuc_av";
const TICKETS_COLLECTION = "tickets";

// Cache the client promise on globalThis so dev hot-reload and serverless
// function reuse don't spawn a new connection per invocation.
function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (see .env.example) or your Vercel project settings."
    );
  }

  if (!globalThis._ccucMongoClientPromise) {
    const client = new MongoClient(uri);
    globalThis._ccucMongoClientPromise = client.connect();
  }
  return globalThis._ccucMongoClientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(DB_NAME);
}

export async function getTicketsCollection() {
  const db = await getDb();
  return db.collection(TICKETS_COLLECTION);
}
