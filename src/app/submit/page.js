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

      <section className={styles.notice} aria-labelledby="notice-heading">
        <p className={styles.noticeEyebrow}>Read before submitting</p>
        <h2 id="notice-heading" className={styles.noticeTitle}>
          Requests with less than 48 hours&apos; notice will not be accepted.
        </h2>
        <p className={styles.noticeBody}>
          Submit AV requests at least <strong>one week</strong> before your
          event to guarantee support.
        </p>
        <ol className={styles.tiers}>
          <li className={`${styles.tier} ${styles.tierOk}`}>
            <span className={styles.tierWhen}>1 week or more</span>
            <span className={styles.tierWhat}>Support guaranteed</span>
          </li>
          <li className={`${styles.tier} ${styles.tierMaybe}`}>
            <span className={styles.tierWhen}>48 hours – 1 week</span>
            <span className={styles.tierWhat}>Subject to availability</span>
          </li>
          <li className={`${styles.tier} ${styles.tierNo}`}>
            <span className={styles.tierWhen}>Under 48 hours</span>
            <span className={styles.tierWhat}>
              Not considered. Any exception is solely at the AV
              department&apos;s discretion. Plan on no.
            </span>
          </li>
        </ol>
      </section>

      <TicketForm />
    </main>
  );
}
