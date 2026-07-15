import { validateScheduleEntry } from "@/lib/schedule/schema";
import { listScheduleRange, setScheduleDay } from "@/lib/schedule/queries";
import { isAdminRequest } from "@/lib/admin-guard";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request) {
  // Read access is public: the landing page shows today's status to
  // everyone, with no auth required. Only PATCH is admin-guarded.
  const dates = request.nextUrl.searchParams.getAll("date");
  if (dates.length === 0 || !dates.every((d) => DATE_RE.test(d))) {
    return Response.json(
      { error: "Provide one or more ?date=YYYY-MM-DD params." },
      { status: 400 }
    );
  }

  try {
    const entries = await listScheduleRange(dates);
    return Response.json({ entries });
  } catch (error) {
    console.error("Failed to list schedule:", error);
    return Response.json(
      { error: "Failed to list schedule." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { errors: { body: "Request body must be valid JSON." } },
      { status: 400 }
    );
  }

  const { valid, errors, value } = validateScheduleEntry(body);
  if (!valid) {
    return Response.json({ errors }, { status: 400 });
  }

  try {
    const entry = await setScheduleDay(value.date, value.status);
    return Response.json({ entry });
  } catch (error) {
    console.error("Failed to update schedule:", error);
    return Response.json(
      { error: "Failed to update schedule." },
      { status: 500 }
    );
  }
}
