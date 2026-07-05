import { validateTicketPatch } from "@/lib/tickets/schema";
import { updateTicket, deleteTicket } from "@/lib/tickets/queries";
import { isAdminRequest } from "@/lib/admin-guard";

export async function PATCH(request, { params }) {
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

  const { valid, errors, value } = validateTicketPatch(body);
  if (!valid) {
    return Response.json({ errors }, { status: 400 });
  }

  const { id } = await params;
  try {
    const ticket = await updateTicket(id, value);
    if (!ticket) {
      return Response.json({ error: "Ticket not found." }, { status: 404 });
    }
    return Response.json({ ticket });
  } catch (error) {
    console.error("Failed to update ticket:", error);
    return Response.json(
      { error: "Failed to update ticket." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const deleted = await deleteTicket(id);
    if (!deleted) {
      return Response.json({ error: "Ticket not found." }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete ticket:", error);
    return Response.json(
      { error: "Failed to delete ticket." },
      { status: 500 }
    );
  }
}
