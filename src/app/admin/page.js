import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/auth";
import styles from "./page.module.css";

export const metadata = { title: "Admin" };

async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}

export default function AdminPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Admin</h1>
      <p className={styles.sub}>
        The ticket dashboard arrives in slice 08.
      </p>
      <form action={logout}>
        <button className={styles.logout} type="submit">
          Log out
        </button>
      </form>
    </main>
  );
}
