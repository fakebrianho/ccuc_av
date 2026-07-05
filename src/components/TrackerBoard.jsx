"use client";

import { motion } from "motion/react";
import styles from "./TrackerBoard.module.css";

const COLUMNS = [
  { status: "triaged", label: "Queued" },
  { status: "in-progress", label: "In progress" },
  { status: "blocked", label: "Blocked" },
  { status: "done", label: "Done" },
];

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export default function TrackerBoard({ tickets }) {
  return (
    <div className={styles.board}>
      {COLUMNS.map(({ status, label }) => {
        const cards = tickets.filter((t) => t.status === status);
        return (
          <section key={status} className={styles.column}>
            <h2 className={styles.columnTitle}>
              {label}
              <span className={styles.count}>{cards.length}</span>
            </h2>
            {cards.length === 0 ? (
              <p className={styles.empty}>Nothing here.</p>
            ) : (
              cards.map((ticket, index) => (
                <motion.article
                  key={ticket._id}
                  className={styles.card}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <div className={styles.cardTop}>
                    <span className={styles[`priority_${ticket.priority}`]}>
                      {ticket.priority}
                    </span>
                    <span className={styles.type}>{ticket.type}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{ticket.title}</h3>
                  <div className={styles.meta}>
                    {ticket.assignee && <span>{ticket.assignee}</span>}
                    {ticket.scheduledFor && (
                      <span>
                        {dateFmt.format(new Date(ticket.scheduledFor))}
                      </span>
                    )}
                  </div>
                </motion.article>
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}
