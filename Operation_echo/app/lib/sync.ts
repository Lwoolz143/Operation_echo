"use client";

import {
  DataSnapshot,
  onValue,
  ref,
  set,
  update,
} from "firebase/database";
import { database, firebaseConfigured } from "./firebase";

export type TeamRecord = {
  name: string;
  ready: boolean;
  joinedAt: number;
};

export type LaunchState = {
  released: boolean;
  releasedAt: number | null;
};

const EVENT_KEY = "operation-echo-launch";
const CHANNEL_KEY = "operation-echo-sync";

const defaultLaunch: LaunchState = { released: false, releasedAt: null };

function emitLocal(type: "teams" | "launch") {
  window.dispatchEvent(new CustomEvent(`${CHANNEL_KEY}:${type}`));
  const channel = new BroadcastChannel(CHANNEL_KEY);
  channel.postMessage(type);
  channel.close();
}

function readLocalTeams(): Record<string, TeamRecord> {
  return JSON.parse(localStorage.getItem(`${EVENT_KEY}:teams`) || "{}");
}

function readLocalLaunch(): LaunchState {
  return JSON.parse(
    localStorage.getItem(`${EVENT_KEY}:launch`) ||
      JSON.stringify(defaultLaunch),
  );
}

export async function registerTeam(id: string, name: string) {
  const team: TeamRecord = { name, ready: true, joinedAt: Date.now() };

  if (firebaseConfigured && database) {
    await set(ref(database, `events/${EVENT_KEY}/teams/${id}`), team);
    return;
  }

  const teams = readLocalTeams();
  teams[id] = team;
  localStorage.setItem(`${EVENT_KEY}:teams`, JSON.stringify(teams));
  emitLocal("teams");
}

export async function releaseFirstEcho() {
  const launch: LaunchState = { released: true, releasedAt: Date.now() };

  if (firebaseConfigured && database) {
    await update(ref(database, `events/${EVENT_KEY}/launch`), launch);
    return;
  }

  localStorage.setItem(`${EVENT_KEY}:launch`, JSON.stringify(launch));
  emitLocal("launch");
}

export async function resetLaunch() {
  if (firebaseConfigured && database) {
    await set(ref(database, `events/${EVENT_KEY}`), {
      teams: {},
      launch: defaultLaunch,
    });
    return;
  }

  localStorage.setItem(`${EVENT_KEY}:teams`, "{}");
  localStorage.setItem(`${EVENT_KEY}:launch`, JSON.stringify(defaultLaunch));
  emitLocal("teams");
  emitLocal("launch");
}

export function subscribeToTeams(
  callback: (teams: Record<string, TeamRecord>) => void,
) {
  if (firebaseConfigured && database) {
    return onValue(
      ref(database, `events/${EVENT_KEY}/teams`),
      (snapshot: DataSnapshot) => callback(snapshot.val() || {}),
    );
  }

  const updateLocal = () => callback(readLocalTeams());
  const channel = new BroadcastChannel(CHANNEL_KEY);
  channel.onmessage = ({ data }) => data === "teams" && updateLocal();
  window.addEventListener(`${CHANNEL_KEY}:teams`, updateLocal);
  updateLocal();

  return () => {
    channel.close();
    window.removeEventListener(`${CHANNEL_KEY}:teams`, updateLocal);
  };
}

export function subscribeToLaunch(
  callback: (launch: LaunchState) => void,
) {
  if (firebaseConfigured && database) {
    return onValue(
      ref(database, `events/${EVENT_KEY}/launch`),
      (snapshot: DataSnapshot) => callback(snapshot.val() || defaultLaunch),
    );
  }

  const updateLocal = () => callback(readLocalLaunch());
  const channel = new BroadcastChannel(CHANNEL_KEY);
  channel.onmessage = ({ data }) => data === "launch" && updateLocal();
  window.addEventListener(`${CHANNEL_KEY}:launch`, updateLocal);
  updateLocal();

  return () => {
    channel.close();
    window.removeEventListener(`${CHANNEL_KEY}:launch`, updateLocal);
  };
}
