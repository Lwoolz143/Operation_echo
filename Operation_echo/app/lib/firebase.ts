"use client";

import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = Object.values(config).every(Boolean);

let app: FirebaseApp | null = null;
let database: Database | null = null;

if (firebaseConfigured && typeof window !== "undefined") {
  app = getApps().length ? getApp() : initializeApp(config);
  database = getDatabase(app);
}

export { database };
