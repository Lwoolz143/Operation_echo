"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "./Shell";
import {
  registerTeam,
  releaseFirstEcho,
  subscribeToLaunch,
  type LaunchState,
} from "../lib/sync";
import { firebaseConfigured } from "../lib/firebase";

type Stage = "landing" | "calibration" | "waiting" | "released";

function createTeamId() {
  return crypto.randomUUID();
}

const teamNames = [
  "The Tree Amigos",
  "The Rolling Stones",
  "The Grass Routes",
  "The Bark Side",
  "Leaf It to Us",
  "Root Awakening",
  "Mulch Ado About Nothing",
  "Trail Blazers",
  "Moss Bosses",
  "Branch Managers",
  "Ivy League",
];

export function ParticipantExperience() {
  const [stage, setStage] = useState<Stage>("landing");
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [launch, setLaunch] = useState<LaunchState>({
    released: false,
    releasedAt: null,
  });
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => subscribeToLaunch(setLaunch), []);

  useEffect(() => {
    if (launch.released && stage === "waiting") setStage("released");
  }, [launch.released, stage]);

  const formattedTeam = useMemo(
    () => teamName.trim() || "Field Team",
    [teamName],
  );

  function beginCalibration() {
    setStage("calibration");
  }

  async function selectTeam(name: string) {
    if (isRegistering) return;
    setIsRegistering(true);
    setTeamName(name);
    const id = teamId || createTeamId();
    setTeamId(id);
    await registerTeam(id, name);
    setStage(launch.released ? "released" : "waiting");
    setIsRegistering(false);
  }

  return (
    <Shell>
      {stage === "landing" && (
        <section className="landing panel-enter">
          <div className="living-atmosphere" aria-hidden="true">
            <span className="drifting-spore spore-one" />
            <span className="drifting-spore spore-two" />
            <span className="drifting-spore spore-three" />
            <span className="leaf-shadow leaf-one">◆</span>
            <span className="leaf-shadow leaf-two">◆</span>
          </div>
          <div className="seal">
            <span className="seal-ring outer" />
            <span className="seal-ring inner" />
            <div className="logo-image-wrap">
              <Image
                src="/operation-echo-logo.png"
                alt="Operation Echo. Nature Remembers."
                width={1024}
                height={1024}
                priority
              />
            </div>
          </div>
          <p className="classification">Classified Proprietary System</p>
          <h1>Operation Echo</h1>
          <p className="hero-copy">
            Nature has preserved something here. This interface helps human
            eyes perceive what nature chooses to show.
          </p>
          <button className="primary-action" onClick={beginCalibration}>
            Activate Field Interface
          </button>
          <p className="microcopy">Field access marker recognized</p>
        </section>
      )}

      {stage === "calibration" && (
        <section className="calibration split-panel panel-enter">
          <div className="instrument">
            <p className="panel-label">Module CA-01</p>
            <h2>Field Calibration</h2>
            <div className="resonance-visual" aria-hidden="true">
              <span className="orbit orbit-one" />
              <span className="orbit orbit-two" />
              <span className="orbit orbit-three" />
              <span className="resonance-core" />
            </div>
            <div className="readout-row">
              <span>Marker</span>
              <strong>Aligned</strong>
            </div>
            <div className="readout-row">
              <span>Natural resonance</span>
              <strong>Present</strong>
            </div>
          </div>

          <div className="team-form">
            <p className="panel-label">Agent Roster</p>
            <h2>Choose Your Team</h2>
            <p>
              Select the team name issued by Headquarters. No typing is
              required.
            </p>
            <div className="team-choice-grid" aria-label="Choose your team">
              {teamNames.map((name) => (
                <button
                  className="team-choice"
                  type="button"
                  key={name}
                  onClick={() => selectTeam(name)}
                  disabled={isRegistering}
                >
                  <span className="team-choice-mark" aria-hidden="true">✦</span>
                  {name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {stage === "waiting" && (
        <section className="waiting panel-enter">
          <div className="waiting-orbit" aria-hidden="true">
            <span />
            <span />
            <i />
          </div>
          <p className="panel-label">Field Marker Aligned</p>
          <h2>{formattedTeam} is ready</h2>
          <p>
            Natural resonance is present. Headquarters will synchronize all
            field teams before the first Echo is shown.
          </p>
          <div className="status-card">
            <span>Observation status</span>
            <strong>Awaiting Headquarters</strong>
          </div>
          <p className="living-line">Nature is holding the memory.</p>
          {!firebaseConfigured && (
            <div className="prototype-release">
              <p>
                Prototype testing is active. Use this control to experience the
                synchronized release without Firebase.
              </p>
              <button
                className="primary-action"
                type="button"
                onClick={() => releaseFirstEcho()}
              >
                Release First Echo
              </button>
            </div>
          )}
        </section>
      )}

      {stage === "released" && (
        <section className="release panel-enter">
          <div className="stone-surface" aria-hidden="true">
            <span className="fracture fracture-one" />
            <span className="fracture fracture-two" />
            <span className="fracture fracture-three" />
            <span className="stone-dust dust-one" />
            <span className="stone-dust dust-two" />
            <span className="stone-dust dust-three" />
          </div>
          <div className="release-copy">
            <p className="panel-label">Initial Echo Lead</p>
            <h2>Stone remembers.</h2>
            <p>
              Where stone descends in a path built for daring feet, the first
              field observation awaits.
            </p>
            <div className="destination">
              <span>Resonance direction</span>
              <strong>Devil&apos;s Staircase</strong>
            </div>
            <p className="microcopy">This lead remains available on your device.</p>
          </div>
        </section>
      )}
    </Shell>
  );
}
