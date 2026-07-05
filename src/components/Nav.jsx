"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Nav.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/responsibilities", label: "Responsibilities" },
  { href: "/submit", label: "Submit Ticket" },
  { href: "/tracker", label: "Tracker" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main">
        <Link href="/" className={styles.brand}>
          CCUC&nbsp;AV
        </Link>
        <ul className={styles.list}>
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={pathname === href ? styles.active : styles.link}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
