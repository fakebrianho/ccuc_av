// Single owner of the schedule-day shape, mirroring src/lib/tickets/schema.js.

export const STATUSES = ["in-office", "out-of-office", "wfh", "afk"];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateScheduleEntry(input) {
  const errors = {};
  const src = input && typeof input === "object" ? input : {};

  const date = typeof src.date === "string" ? src.date.trim() : "";
  if (!DATE_RE.test(date)) {
    errors.date = "Date must be an ISO date string (YYYY-MM-DD).";
  }

  let status = src.status;
  if (status != null && !STATUSES.includes(status)) {
    errors.status = `Status must be one of: ${STATUSES.join(", ")}.`;
  }
  if (status === undefined) status = null;

  const valid = Object.keys(errors).length === 0;
  return { valid, errors, value: valid ? { date, status } : null };
}

export function normalize(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { ...rest, date: _id };
}
