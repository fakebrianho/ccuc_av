"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { STATUSES, PRIORITIES } from "@/lib/tickets/schema";
import styles from "./AdminDashboard.module.css";

const cap = (s) => s[0].toUpperCase() + s.slice(1);

export default function AdminDashboard() {
  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/tickets");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTickets(data.tickets);
      setError(null);
    } catch {
      setError("Couldn't load tickets. Refresh to retry.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(id, body) {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const { ticket } = await res.json();
      setTickets((list) => list.map((t) => (t._id === id ? ticket : t)));
    }
  }

  async function remove(id) {
    const res = await fetch(`/api/tickets/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTickets((list) => list.filter((t) => t._id !== id));
    }
  }

  if (error) return <p className={styles.notice}>{error}</p>;
  if (!tickets) return <p className={styles.notice}>Loading tickets…</p>;

  const queue = tickets.filter((t) => t.status === "new");
  const rest = tickets.filter((t) => t.status !== "new");

  return (
    <div className={styles.dashboard}>
      <section>
        <h2 className={styles.sectionTitle}>
          Triage queue <span className={styles.count}>{queue.length}</span>
        </h2>
        {queue.length === 0 ? (
          <p className={styles.empty}>No new tickets.</p>
        ) : (
          <AnimatePresence>
            {queue.map((t) => (
              <motion.article
                key={t._id}
                className={styles.queueCard}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              >
                <div className={styles.queueBody}>
                  <h3>{t.title}</h3>
                  <p className={styles.desc}>{t.description}</p>
                  <p className={styles.meta}>
                    {cap(t.type)} · {cap(t.priority)}
                    {t.submitterName ? ` · from ${t.submitterName}` : ""}
                  </p>
                </div>
                <div className={styles.queueActions}>
                  <button
                    className={styles.approve}
                    onClick={() => patch(t._id, { status: "triaged" })}
                  >
                    Approve
                  </button>
                  <button
                    className={styles.delete}
                    onClick={() => remove(t._id)}
                  >
                    Delete
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        )}
      </section>

      <section>
        <h2 className={styles.sectionTitle}>
          All tickets <span className={styles.count}>{rest.length}</span>
        </h2>
        {rest.length === 0 ? (
          <p className={styles.empty}>Nothing triaged yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>Scheduled</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((t) => (
                  <tr key={t._id}>
                    <td className={styles.titleCell}>{t.title}</td>
                    <td>
                      <select
                        value={t.status}
                        onChange={(e) =>
                          patch(t._id, { status: e.target.value })
                        }
                      >
                        {STATUSES.filter((s) => s !== "new").map((s) => (
                          <option key={s} value={s}>
                            {cap(s)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={t.priority}
                        onChange={(e) =>
                          patch(t._id, { priority: e.target.value })
                        }
                      >
                        {PRIORITIES.map((p) => (
                          <option key={p} value={p}>
                            {cap(p)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        defaultValue={t.assignee ?? ""}
                        placeholder="—"
                        onBlur={(e) => {
                          const v = e.target.value.trim();
                          if (v !== (t.assignee ?? ""))
                            patch(t._id, { assignee: v || null });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        defaultValue={
                          t.scheduledFor ? t.scheduledFor.slice(0, 10) : ""
                        }
                        onChange={(e) =>
                          patch(t._id, {
                            scheduledFor: e.target.value || null,
                          })
                        }
                      />
                    </td>
                    <td>
                      <button
                        className={styles.delete}
                        onClick={() => remove(t._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
