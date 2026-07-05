import { STATUSES } from "@/lib/tickets/schema";
import { listTickets } from "@/lib/tickets/queries";
import TrackerBoard from "@/components/TrackerBoard";
import styles from "./page.module.css";

export const metadata = { title: "Ticket Tracker" };

// Always reflect current Atlas state.
export const dynamic = "force-dynamic";

export default async function TrackerPage() {
  let tickets = [];
  let unavailable = false;
  try {
    tickets = await listTickets({
      statuses: STATUSES.filter((s) => s !== "new"),
    });
  } catch {
    unavailable = true;
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ticket Tracker</h1>
        <p className={styles.sub}>What we&apos;re working on, and when.</p>
      </header>
      {unavailable ? (
        <p className={styles.notice}>
          The tracker is temporarily unavailable. Try again shortly.
        </p>
      ) : (
        <TrackerBoard tickets={tickets} />
      )}
    </main>
  );
}
