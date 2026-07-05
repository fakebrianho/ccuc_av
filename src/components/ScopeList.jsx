"use client";

import { motion } from "motion/react";
import styles from "./ScopeList.module.css";

export default function ScopeList({ heading, items, tone }) {
  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className={styles.heading}>{heading}</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item} className={styles.item}>
            <span
              className={tone === "in" ? styles.markIn : styles.markOut}
              aria-hidden="true"
            >
              {tone === "in" ? "✓" : "—"}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
