"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Shell } from "./Shell";
import {
  releaseFirstEcho,
  resetLaunch,
  subscribeToLaunch,
  subscribeToTeams,
  type LaunchState,
  type TeamRecord,
} from "../lib/sync";
import { firebaseConfigured } from "../lib/firebase";

export function HostConsole() {
  const [authenticated, setAuthenticated] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [teams, setTeams] = useState<Record<string, TeamRecord>>({});
  const [launch, setLaunch] = useState<LaunchState>({
    released: false,
    releasedAt: null,
  });

  useEffect(() => subscribeToTeams(setTeams), []);
  useEffect(() => subscribeToLaunch(setLaunch), []);

  const teamList = useMemo(
    () => Object.entries(teams).sort((a, b) => a[1].joinedAt - b[1].joinedAt),
    [teams],
  );

  function authenticate(event: FormEvent) {
    event.preventDefault();
    const expected = process.env.NEXT_PUBLIC_HOST_ACCESS_CODE || "CHEDDAR";
    if (code.trim().toUpperCase() !== expected.toUpperCase()) {
      setError("Access code not recognized.");
      return;
    }
    setError("");
    setAuthenticated(true);
  }

  if (!authenticated) {
    return (
      <Shell mode="host">
        <form className="host-login panel-enter" onSubmit={authenticate}>
          <p className="panel-label">Restricted Module</p>
          <h1>Headquarters Control</h1>
          <p>Enter the Professor&apos;s access code to manage field teams.</p>
          <label htmlFor="accessCode">Access code</label>
          <input
            id="accessCode"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            type="password"
            autoFocus
          />
          {error && <p className="form-error">{error}</p>}
          <button className="primary-action" type="submit">
            Authenticate
          </button>
        </form>
      </Shell>
    );
  }

  return (
    <Shell mode="host">
      <section className="host-console panel-enter">
        <div className="host-heading">
          <div>
            <p className="panel-label">Operation Echo</p>
            <h1>Field Team Synchronization</h1>
          </div>
          <span className={`mode-badge ${firebaseConfigured ? "" : "demo"}`}>
            {firebaseConfigured ? "Firebase Live" : "Local Demo"}
          </span>
        </div>

        <div className="host-grid">
          <div className="team-roster">
            <div className="section-title">
              <h2>Teams Ready</h2>
              <strong>{teamList.length}</strong>
            </div>
            <div className="team-list">
              {teamList.length === 0 && (
                <p className="empty-state">
                  Waiting for teams to calibrate their devices.
                </p>
              )}
              {teamList.map(([id, team], index) => (
                <article className="team-row" key={id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{team.name}</strong>
                  <i>Ready</i>
                </article>
              ))}
            </div>
          </div>

          <div className="release-control">
            <p className="panel-label">Shared Observation</p>
            <h2>First Echo</h2>
            <p>
              Release only when every field team is present. All connected
              devices will receive the Echo at the same time.
            </p>
            <div className="release-status">
              <span>Status</span>
              <strong>{launch.released ? "Released" : "Held by Headquarters"}</strong>
            </div>
            <button
              className="primary-action"
              onClick={releaseFirstEcho}
              disabled={launch.released || teamList.length === 0}
            >
              {launch.released ? "First Echo Released" : "Release First Echo"}
            </button>
            <button className="text-action" onClick={resetLaunch}>
              Reset launch test
            </button>
          </div>
        </div>
      </section>
    </Shell>
  );
}
