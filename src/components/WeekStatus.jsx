"use client";

import { useEffect, useState } from "react";
import styles from "./WeekStatus.module.css";

const LABELS = {
  "in-office": "In office",
  "out-of-office": "Out",
  wfh: "WFH",
  afk: "AFK",
};

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

export default function WeekStatus() {
  const [days, setDays] = useState(() => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  });
  const [statusByDate, setStatusByDate] = useState(null); // null = loading

  useEffect(() => {
    let cancelled = false;
    const params = days.map((d) => `date=${toISODate(d)}`).join("&");
    fetch(`/api/schedule?${params}`)
      .then((res) => (res.ok ? res.json() : { entries: [] }))
      .then(({ entries }) => {
        if (cancelled) return;
        const map = {};
        for (const e of entries ?? []) map[e.date] = e.status;
        setStatusByDate(map);
      })
      .catch(() => {
        if (!cancelled) setStatusByDate({});
      });
    return () => {
      cancelled = true;
    };
    // days is derived once at mount from "today"; no need to re-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (statusByDate === null) return null;

  const today = toISODate(new Date());

  return (
    <div className={styles.week}>
      {days.map((d, i) => {
        const date = toISODate(d);
        const status = statusByDate[date] ?? null;
        const known = status != null && LABELS[status];
        return (
          <div
            key={date}
            className={`${styles.day} ${date === today ? styles.isToday : ""}`}
          >
            <span className={styles.dayLabel}>{DAY_LABELS[i]}</span>
            <span className={styles.dateLabel}>{d.getDate()}</span>
            <span
              className={`${styles.dot} ${known ? styles[status] : styles.unknown}`}
            />
            <span className={styles.statusLabel}>
              {known ? LABELS[status] : "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
