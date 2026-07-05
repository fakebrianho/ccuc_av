import LoginForm from "./LoginForm";
import styles from "./page.module.css";

export const metadata = { title: "Admin Login" };

export default function LoginPage() {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.sub}>Enter the admin password to continue.</p>
        <LoginForm />
      </div>
    </main>
  );
}
