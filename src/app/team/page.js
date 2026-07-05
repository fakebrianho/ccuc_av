import { team } from "@/data/team";
import TeamCard from "@/components/TeamCard";
import styles from "./page.module.css";

export const metadata = { title: "Team" };

export default function TeamPage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Team</h1>
        <p className={styles.sub}>Who we are and how to reach us.</p>
      </header>
      <div className={styles.grid}>
        {team.map((member, index) => (
          <TeamCard key={member.email} member={member} index={index} />
        ))}
      </div>
    </main>
  );
}
