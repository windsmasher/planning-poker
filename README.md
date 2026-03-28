# Planning Poker

Real-time planning poker for distributed teams. Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion**, and **Firebase Realtime Database** — static hosting only (no custom backend).

## Prerequisites

- Node.js 18+ (20+ recommended)
- A Firebase project with **Realtime Database** enabled (same region as `databaseURL` in `src/firebase.ts` is fine)

## Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Firebase Realtime Database rules**

   The app expects your database to accept reads/writes under `rooms/`. For development or a private team demo, you can use the sample rules in `database.rules.json` (fully open — anyone with the URL can read/write rooms).

   Deploy rules (requires [Firebase CLI](https://firebase.google.com/docs/cli)):

   ```bash
   firebase deploy --only database --project planning-poker-b9012
   ```

   Or paste the JSON from `database.rules.json` into **Firebase Console → Realtime Database → Rules**.

   **Important:** Open rules are not safe for public production traffic. Prefer authentication and tighter rules before wide release.

3. **Firebase config**

   Client configuration lives in `src/firebase.ts` (already filled in for this project). To use another project, replace `firebaseConfig` there.

## Scripts

| Command        | Description                                      |
| -------------- | ------------------------------------------------ |
| `npm run dev`  | Local dev server (Vite)                         |
| `npm run build`| Typecheck, production build into `docs/`, copy `404.html` |
| `npm run preview` | Serve the production build locally           |

## Local development

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Routing uses the Vite `base` path: `/` in development.

## GitHub Pages

### Base path

For a **project site** (`https://<user>.github.io/<repo>/`), Vite must use `base: /<repo>/` in production. This repo defaults the segment to `planning-poker` in `vite.config.ts`. If your GitHub repository name differs, set:

```bash
VITE_REPO_NAME=your-repo-name npm run build
```

For a **user/org site** (`https://<user>.github.io/` with the repo named `<user>.github.io`), set production `base` to `/` (adjust `vite.config.ts` or use a small env-driven branch in that file).

### SPA fallback

GitHub Pages does not rewrite unknown paths to `index.html`. After each build, `npm run build` copies `docs/index.html` to `docs/404.html` so refreshes and deep links to `/room/...` load the app.

### Why the live site can look blank

If **Pages** is set to **Deploy from a branch** with folder **`/ (root)`**, GitHub serves your **source** tree. The root `index.html` loads `/src/main.tsx`, which only works with the Vite dev server — the browser never runs that bundle, so you get an empty page. Either publish the **built** output (this repo uses the `docs/` folder), or switch to **GitHub Actions** as the Pages source.

### Option A: GitHub Actions (recommended)

This repository includes `.github/workflows/deploy-github-pages.yml`, which:

1. Runs on pushes to `main` (and manual `workflow_dispatch`).
2. Sets `VITE_REPO_NAME` to `${{ github.event.repository.name }}` so the asset base matches the repo.
3. Uploads the `docs/` build output with **GitHub Pages** “GitHub Actions” source.

**One-time repo settings**

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions.
2. Pick the suggested “Deploy to GitHub Pages” / “static” workflow when prompted, or rely on the workflow file already in the repo.
3. The first run may require approving **Actions** permissions for `GITHUB_TOKEN` (read/write for Pages).

The live site URL appears in the workflow run and under **Pages**.

### Option B: Deploy from a branch (`/docs`)

Production files are written to **`docs/`** (Vite `build.outDir`).

1. Build locally (set `VITE_REPO_NAME` if your repo name is not `planning-poker`):

   ```bash
   VITE_REPO_NAME=planning-poker npm run build
   ```

2. **Commit and push** the `docs/` folder (including `assets/`, `index.html`, `404.html`, `.nojekyll`, `favicon.svg`) on `main`.

3. In the repository: **Settings → Pages → Build and deployment → Source:** *Deploy from a branch* → Branch **`main`**, folder **`/docs`** (not `/ (root)`).

After each change to app source, run `npm run build` again and commit the updated `docs/` before pushing.

## Data model (Realtime Database)

```
rooms/
  {roomId}/
    revealed: boolean
    createdAt: number
    participants/
      {participantId}/
        name: string
        vote: 1 | 2 | 3 | 5 | 8 | 13   // omitted until the user picks a card
```

- **Show cards** sets `revealed: true`.
- **Reset** sets `revealed: false` and removes each participant’s `vote`.
- Participant IDs are stored in `sessionStorage` per room so a tab can rejoin the same seat until storage is cleared or the node is removed.

## Project structure

```
├── .github/workflows/deploy-github-pages.yml
├── database.rules.json          # Sample RTDB rules (open; tighten for prod)
├── docs/                        # Production build (commit for “Deploy from /docs”)
├── index.html
├── public/
├── src/
│   ├── App.tsx                  # Routes + Router basename
│   ├── firebase.ts
│   ├── main.tsx
│   ├── index.css
│   ├── types.ts
│   ├── components/              # UI pieces + motion
│   ├── hooks/useRoom.ts         # Live room subscription
│   ├── lib/roomId.ts, roomService.ts
│   └── pages/Home.tsx, Room.tsx
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## License

Use and modify freely for your team.
