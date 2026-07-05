import { validateNewTicket, STATUSES } from "@/lib/tickets/schema";
import { createTicket, listTickets } from "@/lib/tickets/queries";
import { isAdminRequest } from "@/lib/admin-guard";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { errors: { body: "Request body must be valid JSON." } },
      { status: 400 }
    );
  }

  const { valid, errors, value } = validateNewTicket(body);
  if (!valid) {
    return Response.json({ errors }, { status: 400 });
  }

  try {
    const ticket = await createTicket(value);
    return Response.json({ ticket }, { status: 201 });
  } catch (error) {
    console.error("Failed to create ticket:", error);
    return Response.json(
      { error: "Failed to create ticket." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const scope = request.nextUrl.searchParams.get("scope");

  try {
    let tickets;
    if (scope === "public") {
      // Public tracker: only tickets promoted out of the triage queue.
      tickets = await listTickets({
        statuses: STATUSES.filter((s) => s !== "new"),
      });
    } else {
      // Full listing (including "new") is admin-only.
      if (!(await isAdminRequest())) {
        return Response.json({ error: "Unauthorized." }, { status: 401 });
      }
      tickets = await listTickets();
    }
    return Response.json({ tickets });
  } catch (error) {
    console.error("Failed to list tickets:", error);
    return Response.json(
      { error: "Failed to list tickets." },
      { status: 500 }
    );
  }
}
