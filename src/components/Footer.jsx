import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          CCUC AV · Audio &amp; Visual Department
        </p>
        <Link href="/login" className={styles.admin}>
          Admin
        </Link>
      </div>
    </footer>
  );
}
