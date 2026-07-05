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

export function validateTicketPatch(input) {
  const errors = {};
  const src = input && typeof input === "object" ? input : {};
  const value = {};

  if ("title" in src) {
    const title = typeof src.title === "string" ? src.title.trim() : "";
    if (!title) errors.title = "Title is required.";
    else if (title.length > 200)
      errors.title = "Title must be 200 characters or fewer.";
    else value.title = title;
  }

  if ("description" in src) {
    const description =
      typeof src.description === "string" ? src.description.trim() : "";
    if (!description) errors.description = "Description is required.";
    else if (description.length > 5000)
      errors.description = "Description must be 5000 characters or fewer.";
    else value.description = description;
  }

  if ("type" in src) {
    if (!TYPES.includes(src.type))
      errors.type = `Type must be one of: ${TYPES.join(", ")}.`;
    else value.type = src.type;
  }

  if ("priority" in src) {
    if (!PRIORITIES.includes(src.priority))
      errors.priority = `Priority must be one of: ${PRIORITIES.join(", ")}.`;
    else value.priority = src.priority;
  }

  if ("status" in src) {
    if (!STATUSES.includes(src.status))
      errors.status = `Status must be one of: ${STATUSES.join(", ")}.`;
    else value.status = src.status;
  }

  if ("assignee" in src) {
    if (src.assignee == null || src.assignee === "") {
      value.assignee = null;
    } else if (typeof src.assignee !== "string" || src.assignee.length > 100) {
      errors.assignee = "Assignee must be a string of 100 characters or fewer.";
    } else {
      value.assignee = src.assignee.trim();
    }
  }

  if ("scheduledFor" in src) {
    if (src.scheduledFor == null || src.scheduledFor === "") {
      value.scheduledFor = null;
    } else {
      const date = new Date(src.scheduledFor);
      if (Number.isNaN(date.getTime()))
        errors.scheduledFor = "Scheduled date must be a valid date.";
      else value.scheduledFor = date;
    }
  }

  const valid = Object.keys(errors).length === 0;
  if (valid && Object.keys(value).length === 0) {
    return {
      valid: false,
      errors: { patch: "No updatable fields provided." },
      value: null,
    };
  }
  return { valid, errors, value: valid ? value : null };
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
