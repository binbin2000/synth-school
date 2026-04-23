# Synth School

An interactive, browser-based course for learning synthwave music production with the Arturia MiniFreak. 16 lessons across 6 modules — from acoustic basics to finishing a complete track — with interactive elements built directly in the browser using the Web Audio API.

## Features

- **16 lessons in 6 modules** covering sound theory, music theory, the MiniFreak hardware, sound design (ADSR, LFO, effects), and composition
- **Interactive audio** — virtual piano, ADSR envelope editor with draggable handles, waveform comparisons, arpeggio demos
- **Per-lesson quizzes** with pass-gating (minimum score required to unlock the next lesson)
- **Skip lesson** — users can skip ahead and return later
- **Multi-user profiles** — each family member can have their own profile with independent progress
- **Bilingual** — full Swedish and English versions of all lessons; language is set per profile
- **Progress persistence** — saved server-side in a Docker volume (survives image upgrades); localStorage as offline fallback
- **Zero build step** — plain HTML, CSS, and vanilla JS; open `index.html` directly or serve via Docker

---

## Architecture

```
Synth school/
├── index.html              SPA shell (four screens toggled via CSS)
├── css/
│   └── style.css           Synthwave design system
├── js/
│   ├── i18n.js             UI strings (sv/en) + getLessons/getModules helpers
│   ├── lessons.js          All lesson data — Swedish
│   ├── lessons-en.js       All lesson data — English
│   ├── quiz.js             Quiz engine (uses I18n)
│   ├── piano.js            Virtual piano via Web Audio API
│   ├── adsr-vis.js         Interactive ADSR envelope visualiser (Canvas 2D)
│   ├── synth.js            Audio demo helpers (chords, arpeggios)
│   ├── profiles.js         Profile API client with localStorage fallback
│   └── app.js              Orchestrator: navigation, rendering, state
├── server/
│   └── server.js           Node.js HTTP API (no npm dependencies)
├── nginx.conf              Nginx config — serves static files, proxies /api/
├── Dockerfile              Single container: node:20-alpine + nginx
├── docker-compose.yml      Production deployment example
└── .github/
    └── workflows/
        └── docker-publish.yml  Builds and pushes to ghcr.io on push to main
```

### Single-container design

One Docker container runs both nginx (static files + reverse proxy) and the Node.js API server:

```
nginx (port 80)  ──/api/──►  Node.js (port 3001, localhost)
                 ──/*────►   /usr/share/nginx/html  (static SPA)
```

Started with: `node /app/server.js & nginx -g 'daemon off;'`

### Progress persistence

```
localStorage  ←──── always written immediately (reliable backup)
API (profiles/:id PUT)  ←──── debounced 700 ms save when a profile is active
```

If the API is unavailable (local file mode), the app degrades gracefully to localStorage only — no profile screen is shown.

---

## Profiles

Users can create multiple named profiles (with an emoji avatar and a language preference). Profiles are stored as JSON files in a Docker volume and survive container restarts and image upgrades.

- Profile data path: `/data/<uuid>.json` inside the container
- Active profile is stored in `localStorage` (`synthSchoolActiveProfile`)
- The API is detected at startup with a 1.5 s timeout; `file:` protocol skips detection immediately

---

## Language support

Each profile stores a `lang` field (`"sv"` or `"en"`). The language can also be toggled at any time using the 🇬🇧/🇸🇪 button in the top navigation bar. The choice is persisted both on the active profile and in `localStorage` (`synthSchoolLang`).

`I18n.getLessons()` and `I18n.getModules()` return the correct dataset for the current language. All UI strings are looked up via `I18n.t('key')`.

---

## Running locally

Open `index.html` directly in a browser. The app works fully offline in this mode — profiles are not available but progress is saved to `localStorage`.

---

## Docker deployment

### Build and run locally

```bash
docker build -t synth-school .
docker run -p 8080:80 -v synth-school-data:/data synth-school
```

Open [http://localhost:8080](http://localhost:8080).

### Production (docker-compose)

Edit `docker-compose.yml` and replace `YOUR_GITHUB_USERNAME/YOUR_REPO_NAME` with your actual GitHub repository path, then:

```bash
docker compose up -d
```

Profile data is stored in the named volume `profiles_data`. To back it up:

```bash
docker run --rm \
  -v synth-school_profiles_data:/data \
  -v $(pwd):/out \
  alpine tar czf /out/profiles-backup.tar.gz /data
```

---

## GitHub Actions — publish to ghcr.io

`.github/workflows/docker-publish.yml` triggers on every push to `main` and on version tags (`v*.*.*`). It builds the image and pushes it to the GitHub Container Registry:

```
ghcr.io/<owner>/<repo>:main
ghcr.io/<owner>/<repo>:<version>
ghcr.io/<owner>/<repo>:sha-<short-sha>
```

No secrets need to be configured — it uses the built-in `GITHUB_TOKEN`.

---

## Modules and lessons

| Module | Accent | Lessons |
|--------|--------|---------|
| 1 — Sound & Synths | Purple | L1: What is Sound?, L2: What is a Synth? |
| 2 — Music Theory | Cyan | L3: Notes & The Keyboard, L4: Scales, L5: Chords & Progressions |
| 3 — Arturia MiniFreak | Pink | L6: Interface Overview, L7: Oscillators A & B, L8: The Filter |
| 4 — Shape Your Sound | Cyan | L9: ADSR, L10: LFO, L11: Effects (Reverb/Delay/Chorus) |
| 5 — Creating Synthwave | Purple | L12: Lead Sounds, L13: Pad Sounds, L14: Arpeggio & Sequencer |
| 6 — Your First Track | Pink | L15: Song Structure, L16: Putting It All Together |

---

## Tech stack

- **Frontend**: Vanilla JS (ES6+), CSS custom properties, Web Audio API, Canvas 2D
- **Backend**: Node.js 20 (built-in `http`, `fs`, `crypto` — zero npm dependencies)
- **Server**: nginx on Alpine Linux
- **Container**: `node:20-alpine` (nginx installed via `apk`)
- **CI/CD**: GitHub Actions → ghcr.io
