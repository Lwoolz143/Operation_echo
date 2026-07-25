import type { ReactNode } from "react";

export function Shell({
  children,
  mode = "field",
}: {
  children: ReactNode;
  mode?: "field" | "host";
}) {
  return (
    <main className={`app-shell ${mode === "host" ? "host-shell" : ""}`}>
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <div>
          <span className="eyebrow">Cheese Headquarters</span>
          <strong>Nature Preservation Interface</strong>
        </div>
        <div className="system-id">
          <span className="live-dot" />
          {mode === "host" ? "HQ CONTROL" : "FIELD UNIT 01"}
        </div>
      </header>
      {children}
      <footer className="footer">
        <span>Nature Preservation Department</span>
        <span>Authorized Agents Only</span>
      </footer>
    </main>
  );
}
