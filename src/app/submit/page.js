import TicketForm from "@/components/TicketForm";
import styles from "./page.module.css";

export const metadata = { title: "Submit a Ticket" };

export default function SubmitPage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Submit a Ticket</h1>
        <p className={styles.sub}>
          Report an issue or request AV support. Tickets are reviewed before
          they appear on the tracker.
        </p>
      </header>
      <TicketForm />
    </main>
  );
}
