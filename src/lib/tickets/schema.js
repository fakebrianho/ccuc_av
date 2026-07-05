// Single owner of the ticket shape. Every layer (API, form, tracker, admin)
// imports from here — no re-declared shapes. Keep this module free of
// mongodb imports so it can run in any environment (client, edge, node eval).

export const TYPES = ["bug", "request"];
export const PRIORITIES = ["low", "medium", "high", "urgent"];
export const STATUSES = ["new", "triaged", "in-progress", "blocked", "done"];

export function validateNewTicket(input) {
  const errors = {};
  const src = input && typeof input === "object" ? input : {};

  const title = typeof src.title === "string" ? src.title.trim() : "";
  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length > 200) {
    errors.title = "Title must be 200 characters or fewer.";
  }

  const description =
    typeof src.description === "string" ? src.description.trim() : "";
  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length > 5000) {
    errors.description = "Description must be 5000 characters or fewer.";
  }

  const type = typeof src.type === "string" ? src.type.trim() : "";
  if (!TYPES.includes(type)) {
    errors.type = `Type must be one of: ${TYPES.join(", ")}.`;
  }

  const priority = typeof src.priority === "string" ? src.priority.trim() : "";
  if (!PRIORITIES.includes(priority)) {
    errors.priority = `Priority must be one of: ${PRIORITIES.join(", ")}.`;
  }

  let submitterName = null;
  if (src.submitterName != null && src.submitterName !== "") {
    if (typeof src.submitterName !== "string") {
      errors.submitterName = "Submitter name must be a string.";
    } else {
      submitterName = src.submitterName.trim();
      if (submitterName.length > 100) {
        errors.submitterName =
          "Submitter name must be 100 characters or fewer.";
      }
      if (submitterName === "") submitterName = null;
    }
  }

  const valid = Object.keys(errors).length === 0;
  return {
    valid,
    errors,
    value: valid
      ? { title, description, type, priority, submitterName }
      : null,
  };
}

export function normalize(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return {
    ...rest,
    _id: _id != null ? String(_id) : null,
    createdAt:
      rest.createdAt instanceof Date
        ? rest.createdAt.toISOString()
        : rest.createdAt ?? null,
    updatedAt:
      rest.updatedAt instanceof Date
        ? rest.updatedAt.toISOString()
        : rest.updatedAt ?? null,
  };
}
