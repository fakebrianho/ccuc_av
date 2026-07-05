import Link from "next/link";
import { responsibilities } from "@/data/responsibilities";
import ScopeList from "@/components/ScopeList";
import styles from "./page.module.css";

export const metadata = { title: "Responsibilities" };

export default function ResponsibilitiesPage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Responsibilities</h1>
        <p className={styles.sub}>
          What the AV department covers, and what it doesn&apos;t.
        </p>
      </header>
      <div className={styles.columns}>
        <ScopeList heading="We handle" items={responsibilities.does} tone="in" />
        <ScopeList
          heading="Out of scope"
          items={responsibilities.doesNot}
          tone="out"
        />
      </div>
      <p className={styles.cta}>
        Need something in scope?{" "}
        <Link href="/submit" className={styles.ctaLink}>
          Submit a ticket
        </Link>
        .
      </p>
    </main>
  );
}
