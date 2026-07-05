// Ephemeral MongoDB + seed data for local verification of the ticket flow.
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";

const mem = await MongoMemoryServer.create({ instance: { port: 27099 } });
const uri = mem.getUri();
console.log("MEMDB_URI=" + uri);

const client = new MongoClient(uri);
await client.connect();
const col = client.db("ccuc_av").collection("tickets");

const now = new Date();
const day = 86400000;
await col.insertMany([
  { title: "Stream audio drops out mid-service", description: "x", type: "bug", priority: "urgent", status: "in-progress", assignee: "Jordan Lee", scheduledFor: new Date(now.getTime() + day), createdAt: now, updatedAt: now, submitterName: "Pat" },
  { title: "Projector color calibration", description: "x", type: "bug", priority: "medium", status: "triaged", assignee: null, scheduledFor: null, createdAt: now, updatedAt: now, submitterName: null },
  { title: "Wireless mic for youth night", description: "x", type: "request", priority: "high", status: "triaged", assignee: "Casey Kim", scheduledFor: new Date(now.getTime() + 3 * day), createdAt: now, updatedAt: now, submitterName: "Sam" },
  { title: "Replace HDMI run to booth", description: "x", type: "request", priority: "low", status: "blocked", assignee: "Alex Rivera", scheduledFor: null, createdAt: now, updatedAt: now, submitterName: null },
  { title: "Podcast feed setup", description: "x", type: "request", priority: "medium", status: "done", assignee: "Sam Patel", scheduledFor: null, createdAt: now, updatedAt: now, submitterName: null },
  { title: "Untriaged: new lapel mic request", description: "x", type: "request", priority: "low", status: "new", assignee: null, scheduledFor: null, createdAt: now, updatedAt: now, submitterName: "Visitor" },
]);
await client.close();
console.log("seeded");
// Keep the server alive until killed.
setInterval(() => {}, 1 << 30);
