import { getScheduleCollection } from "@/lib/db";
import { normalize } from "@/lib/schedule/schema";

// Days are keyed by their ISO date string (YYYY-MM-DD) as the Mongo _id.
export async function listScheduleRange(dates) {
  const collection = await getScheduleCollection();
  const docs = await collection.find({ _id: { $in: dates } }).toArray();
  return docs.map(normalize);
}

export async function setScheduleDay(date, status) {
  const collection = await getScheduleCollection();
  if (status == null) {
    await collection.deleteOne({ _id: date });
    return { date, status: null };
  }
  const doc = await collection.findOneAndUpdate(
    { _id: date },
    { $set: { status, updatedAt: new Date() } },
    { upsert: true, returnDocument: "after" }
  );
  return normalize(doc);
}
