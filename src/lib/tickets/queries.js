import { ObjectId } from "mongodb";
import { getTicketsCollection } from "@/lib/db";
import { normalize } from "@/lib/tickets/schema";

const UPDATABLE_FIELDS = [
  "status",
  "priority",
  "type",
  "assignee",
  "scheduledFor",
  "title",
  "description",
];

export async function createTicket(input) {
  const collection = await getTicketsCollection();
  const now = new Date();
  const doc = {
    ...input,
    status: "new",
    assignee: null,
    scheduledFor: null,
    createdAt: now,
    updatedAt: now,
  };
  const result = await collection.insertOne(doc);
  return normalize({ ...doc, _id: result.insertedId });
}

export async function listTickets({ statuses } = {}) {
  const collection = await getTicketsCollection();
  const filter =
    Array.isArray(statuses) && statuses.length > 0
      ? { status: { $in: statuses } }
      : {};
  const docs = await collection
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(normalize);
}

export async function updateTicket(id, patch) {
  const collection = await getTicketsCollection();
  const $set = { updatedAt: new Date() };
  for (const field of UPDATABLE_FIELDS) {
    if (patch && Object.prototype.hasOwnProperty.call(patch, field)) {
      $set[field] = patch[field];
    }
  }
  const doc = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set },
    { returnDocument: "after" }
  );
  return normalize(doc);
}

export async function deleteTicket(id) {
  const collection = await getTicketsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
