// Temporary scaffold for routes whose slices haven't landed yet
// (team: 02, responsibilities: 03, submit: 05, tracker: 06).
// Each owning slice replaces its usage; delete this file when the
// last placeholder route is implemented.
export default function PagePlaceholder({ title, note }) {
  return (
    <main
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "var(--space-24) var(--space-6)",
        gap: "var(--space-4)",
      }}
    >
      <h1 style={{ fontSize: "var(--text-2xl)" }}>{title}</h1>
      <p style={{ color: "var(--fg-muted)" }}>{note}</p>
    </main>
  );
}
