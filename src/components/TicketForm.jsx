"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TYPES, PRIORITIES, validateNewTicket } from "@/lib/tickets/schema";
import styles from "./TicketForm.module.css";

const initialForm = {
  title: "",
  description: "",
  type: "bug",
  priority: "medium",
  submitterName: "",
  contactEmail: "",
  contactPhone: "",
};

const DESCRIPTION_PLACEHOLDER = [
  "Please include:",
  "• What the event is",
  "• Which congregation it's for",
  "• Approximate number of people (if any)",
  "• AV needs (mics, projection, livestream, etc.)",
  "• Location / room",
].join("\n");

export default function TicketForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | submitting | success

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    const { valid, errors: clientErrors, value } = validateNewTicket(form);
    setErrors(clientErrors);
    if (!valid) return;

    setState("submitting");
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      if (res.status === 201) {
        setForm(initialForm);
        setState("success");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setErrors(data.errors ?? { form: "Something went wrong. Try again." });
      setState("idle");
    } catch {
      setErrors({ form: "Network error. Try again." });
      setState("idle");
    }
  }

  if (state === "success") {
    return (
      <motion.div
        className={styles.success}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Ticket received</h2>
        <p>We&apos;ll review it and add it to the tracker.</p>
        <button
          className={styles.secondary}
          onClick={() => setState("idle")}
          type="button"
        >
          Submit another
        </button>
      </motion.div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Field label="Title" error={errors.title}>
        <input
          className={styles.input}
          value={form.title}
          onChange={set("title")}
          maxLength={200}
          aria-invalid={Boolean(errors.title)}
          required
        />
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          className={styles.textarea}
          value={form.description}
          onChange={set("description")}
          placeholder={DESCRIPTION_PLACEHOLDER}
          rows={6}
          maxLength={5000}
          aria-invalid={Boolean(errors.description)}
          required
        />
      </Field>

      <div className={styles.row}>
        <Field label="Type" error={errors.type}>
          <select
            className={styles.input}
            value={form.type}
            onChange={set("type")}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "bug" ? "Bug / issue" : "Request"}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Priority" error={errors.priority}>
          <select
            className={styles.input}
            value={form.priority}
            onChange={set("priority")}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p[0].toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Your name (optional)" error={errors.submitterName}>
        <input
          className={styles.input}
          value={form.submitterName}
          onChange={set("submitterName")}
          maxLength={100}
        />
      </Field>

      <div className={styles.row}>
        <Field label="Email" error={errors.contactEmail}>
          <input
            className={styles.input}
            type="email"
            autoComplete="email"
            value={form.contactEmail}
            onChange={set("contactEmail")}
            maxLength={254}
            aria-invalid={Boolean(errors.contactEmail)}
            required
          />
        </Field>

        <Field label="Phone number" error={errors.contactPhone}>
          <input
            className={styles.input}
            type="tel"
            autoComplete="tel"
            value={form.contactPhone}
            onChange={set("contactPhone")}
            maxLength={30}
            aria-invalid={Boolean(errors.contactPhone)}
            required
          />
        </Field>
      </div>

      <AnimatePresence>
        {errors.form && (
          <motion.p
            className={styles.formError}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {errors.form}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        className={styles.submit}
        type="submit"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? "Submitting…" : "Submit ticket"}
      </button>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}
