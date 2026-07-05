import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>CCUC AV Team</h1>
      <p className={styles.subtitle}>
        Sound, video, and lighting — done well, so worship isn&apos;t
        interrupted.
      </p>
    </main>
  );
}
