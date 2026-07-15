"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./ScheduleTracker.module.css";

const STATUSES = [
  { value: "in-office", label: "In office" },
  { value: "out-of-office", label: "Out of office" },
  { value: "wfh", label: "WFH" },
  { value: "afk", label: "AFK" },
];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfWeek(date) {
  const d = new Date(date);
  const dow = d.getDay(); // 0 = Sunday
  const diff = dow === 0 ? -6 : 1 - dow; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function ScheduleTracker() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [statusByDate, setStatusByDate] = useState({});
  const [error, setError] = useState(null);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const load = useCallback(async (weekDays) => {
    const params = weekDays.map((d) => `date=${toISODate(d)}`).join("&");
    try {
      const res = await fetch(`/api/schedule?${params}`);
      if (!res.ok) throw new Error();
      const { entries } = await res.json();
      const map = {};
      for (const e of entries) map[e.date] = e.status;
      setStatusByDate(map);
      setError(null);
    } catch {
      setError("Couldn't load the schedule. Refresh to retry.");
    }
  }, []);

  useEffect(() => {
    load(days);
  }, [days, load]);

  async function setStatus(date, status) {
    const prev = statusByDate[date] ?? null;
    const next = prev === status ? null : status;
    setStatusByDate((m) => ({ ...m, [date]: next }));
    const res = await fetch("/api/schedule", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, status: next }),
    });
    if (!res.ok) {
      setStatusByDate((m) => ({ ...m, [date]: prev }));
    }
  }

  const today = toISODate(new Date());
  const monthLabel = weekStart.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <section>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Weekly schedule</h2>
        <div className={styles.nav}>
          <button
            type="button"
            onClick={() =>
              setWeekStart((w) => {
                const d = new Date(w);
                d.setDate(d.getDate() - 7);
                return d;
              })
            }
          >
            ‹
          </button>
          <span className={styles.month}>{monthLabel}</span>
          <button
            type="button"
            onClick={() =>
              setWeekStart((w) => {
                const d = new Date(w);
                d.setDate(d.getDate() + 7);
                return d;
              })
            }
          >
            ›
          </button>
          <button
            type="button"
            className={styles.today}
            onClick={() => setWeekStart(startOfWeek(new Date()))}
          >
            Today
          </button>
        </div>
      </div>

      {error && <p className={styles.notice}>{error}</p>}

      <div className={styles.grid}>
        {days.map((d, i) => {
          const date = toISODate(d);
          const status = statusByDate[date] ?? null;
          return (
            <div
              key={date}
              className={`${styles.dayCard} ${date === today ? styles.isToday : ""}`}
            >
              <div className={styles.dayLabel}>{DAY_LABELS[i]}</div>
              <div className={styles.dateLabel}>{d.getDate()}</div>
              <div className={styles.statusOptions}>
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    className={`${styles.statusButton} ${styles[s.value]} ${
                      status === s.value ? styles.active : ""
                    }`}
                    onClick={() => setStatus(date, s.value)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
