"use client";

import { useActionState } from "react";
import { login } from "./actions";
import styles from "./page.module.css";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form className={styles.form} action={action}>
      <label className={styles.label} htmlFor="password">
        Password
      </label>
      <input
        className={styles.input}
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
      />
      {state?.error ? (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      ) : null}
      <button className={styles.button} type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
