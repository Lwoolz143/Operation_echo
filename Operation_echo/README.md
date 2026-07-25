# Nature Preservation Interface

The first working Operation Echo web application. It includes:

- Nature Preservation Department landing screen
- Team-name calibration
- Waiting-for-Headquarters state
- Headquarters control route at `/host`
- Synchronized first-Echo release with Firebase Realtime Database
- Local demo synchronization when Firebase is not configured

The story rule is simple: nature reveals. The interface only helps Agents
perceive what nature chooses to show.

## 1. Install and run

Node.js 22 or newer is required.

```bash
pnpm install
pnpm dev
```

Open the local address shown in the terminal.

- Participant experience: `/`
- Headquarters control: `/host`

Without Firebase configuration, open both routes in tabs in the same browser.
They synchronize through local browser storage for testing.

The default local Headquarters access code is `CHEDDAR`.

## 2. Create the Firebase Realtime Database

1. Open the existing Operation Echo project in the Firebase Console.
2. Open **Build**, then **Realtime Database**.
3. Choose **Create Database**.
4. Choose the closest region.
5. Start in locked mode.
6. Open **Project settings**.
7. Under **Your apps**, select the Operation Echo web app.
8. Copy the Firebase configuration values.

## 3. Add local environment values

Copy `.env.example` to a new file named `.env.local`.

Fill in every Firebase value exactly as shown by Firebase:

```text
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_HOST_ACCESS_CODE=
```

Choose a private Headquarters access code for the last value.

Restart the development server after editing `.env.local`.

## 4. Realtime Database rules for a private test

These rules allow the current prototype to synchronize. They are suitable only
for a controlled private test because the browser writes directly to Firebase.

```json
{
  "rules": {
    "events": {
      "operation-echo-launch": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

Do not use open write rules for a public event. Before public launch, add
Firebase Authentication and restrict Headquarters writes to the administrator.

## 5. Test synchronized release

1. Open `/host` in one browser.
2. Open `/` in two or more other browser windows or devices.
3. Enter a different team name on each participant screen.
4. Confirm every team appears at Headquarters.
5. Press **Release First Echo**.
6. Confirm every waiting device changes to the Stone Echo lead.

## 6. NFC field marker

Program the first NFC marker with the public participant URL. Example:

```text
https://your-domain.example/
```

The marker provides resonance alignment. It does not store, create, or amplify
an Echo.

## Important security note

`NEXT_PUBLIC_HOST_ACCESS_CODE` is a convenience gate for this prototype. Values
prefixed with `NEXT_PUBLIC_` are visible in the browser. Use Firebase
Authentication before the live event.
