<div align="center">

<img src="assets/Logo.png" alt="Logo" width="80" />

<h1>YouTube Music API</h1>

<p><strong>Zero-config YouTube Music REST API — search · stream · lyrics · download</strong></p>

[![Deno](https://img.shields.io/badge/Deno-2.0+-000?logo=deno&logoColor=white&style=flat-square)](https://deno.land)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org)
[![Deploy](https://img.shields.io/badge/Deno_Deploy-Live-00C4B4?logo=deno&style=flat-square)](https://deno.com/deploy)
[![License](https://img.shields.io/github/license/raihan-rifat007/YouTube-API?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-7.0.0-white?style=flat-square)](deno.json)

<br/>

[**Live Demo**](https://raihan07-youtubeapi.raihan07.deno.net) · [API Docs](#-api-reference) · [Download Bug Fix](#-download-bug--root-cause--fix) · [Deploy](#-deployment)

</div>

---

<details>
<summary><b>Table of Contents</b></summary>

- [Overview](#-overview)
- [Download Bug — Root Cause & Fix](#-download-bug--root-cause--fix)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Setup](#-setup)
- [API Reference](#-api-reference)
- [UI Features](#-ui-features)
- [Architecture](#-architecture)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

</details>

---

## ✨ Overview

A **Deno 2.0 + TypeScript** REST API that wraps YouTube Music's internal `InnerTube` endpoints — no API key required. Ships with a built-in web UI (`ui.html`) featuring glassmorphism design, grid search results, audio player, and MP3 download.

| Feature | Details |
|---|---|
| **Runtime** | Deno 2.0+ (not Node.js — use `deno task dev`, not `npm run dev`) |
| **Auth** | Zero API keys needed |
| **Search** | Songs, Albums, Artists, Playlists, Videos with autocomplete |
| **Streaming** | Piped + Invidious multi-instance fallback |
| **Download** | cobalt.tools → Piped → Invidious cascade; blob-based for correct filename |
| **Lyrics** | Synced (LRC) + plain via LRCLib |
| **Artist data** | Last.fm bio, listener count, tags |
| **UI** | Liquid glass dark UI, grid cards, mini player, expanded player, lyrics panel |

---

## 🐛 Download Bug — Root Cause & Fix

> **Symptom:** clicking Download saved a `.json` file (or "Failed — No file" in Chrome)

### Why it happened

**Problem 1 — JSON body piped as audio**

When Piped and Invidious instances were both unavailable, the old handler returned early:

```typescript
// ❌ OLD — sends JSON body; browser saves "Song.json" or "Song.webm" with JSON content
if (!streamData) return json({ success: false, error: "No stream" }, 404);
```

Chrome ignores `a.download="Song.mp3"` when the server responds with
`Content-Type: application/json`. It names the file using the detected type → `.json`.

**Problem 2 — Unvalidated upstream responses**

When a Piped/Invidious instance was degraded (returned an HTML error page instead of audio), the old code piped that HTML body straight to the client — no `Content-Type` check:

```typescript
// ❌ OLD — pipes HTML/JSON error page as if it were audio
return new Response(audioRes.body, { status: 200, headers });
```

**Problem 3 — anchor-based download can't enforce filename across redirects**

```javascript
// ❌ OLD — Chrome overrides a.download for cross-origin or non-2xx responses
a.href = '/api/download?id=...';
a.download = 'Song.mp3';
a.click();
```

### The Fix (3 layers)

**`src/routes/stream.ts`** — `/api/download` now uses 302 redirects, never pipes:

```
Request → /api/download?id=VIDEO_ID
            │
            ▼
  Layer 1: cobalt.tools POST
            │ success → 302 → cobalt tunnel/redirect URL (MP3)
            │ fail ↓
  Layer 2: Piped best audio URL
            │ success → 302 → piped audio stream
            │ fail ↓
  Layer 3: Invidious /latest_version?itag=140 (m4a)
            │ success → 302 → invidious direct audio
            │ fail ↓
  503 JSON  ← client fetch() sees !res.ok → shows toast, never saves file
```

**`ui.html`** — `fetchBlob()` replaces anchor clicks, forces correct filename:

```javascript
// ✅ NEW — fetch + blob + createObjectURL always honours a.download="Song.mp3"
function fetchBlob(url, filename, cb) {
  fetch(url)                               // follows the 302 redirect
    .then(r => { if (!r.ok) throw r; return r.blob(); })
    .then(blob => {
      var burl = URL.createObjectURL(blob); // same-origin blob URL
      var a = document.createElement('a');
      a.href  = burl;
      a.download = filename;               // "Song.mp3" — always used for blobs
      a.click();
      URL.revokeObjectURL(burl);
    });
}
```

`createObjectURL()` creates a `blob:` URL — Chrome **always** uses `a.download` for blob URLs, regardless of content type or redirect history.

---

## 📁 Project Structure

```
YouTubeMusicAPI/
├── main.ts                      # Deno.serve entry point + router
├── ui.ts                        # Reads & caches ui.html for the / route
├── ui.html                      # Full web UI (liquid glass, grid, player)
├── deno.json                    # Tasks, permissions, import map
├── deno.lock                    # Lockfile (commit this)
├── assets/
│   └── Logo.png                 # App logo → served at /assets/Logo.png
└── src/
    ├── helpers/
    │   ├── response.ts          # json(), error(), corsHeaders utilities
    │   ├── region.ts            # Geo / region helpers
    │   └── router.ts            # Lightweight URL pattern router
    ├── routes/
    │   ├── search.ts            # /api/search · /api/search/suggestions · /api/yt_search
    │   ├── content.ts           # /api/songs/:id · /api/albums/:id · /api/artists/:id · /api/playlists/:id
    │   ├── discover.ts          # /api/home · /api/charts · /api/related/:id · /api/radio · /api/moods · /api/trending
    │   ├── feed.ts              # Feed endpoints
    │   ├── info.ts              # /api/lyrics · /api/artist/info · /api/track/info
    │   └── stream.ts            # /api/stream · /api/download (fixed) · /api/proxy · /api/music/find
    └── services/
        ├── ytmusic.ts           # YouTube Music InnerTube wrapper
        ├── ytmusic-parser.ts    # Response normaliser
        ├── youtube-search.ts    # YouTube (non-Music) search
        ├── streaming.ts         # Piped + Invidious instance rotator
        ├── lyrics.ts            # LRCLib integration
        ├── lastfm.ts            # Last.fm artist/track info
        ├── discovery.ts         # Charts, radio, trending
        └── entities.ts          # Combined entity resolver
```

---

## ✅ Prerequisites

- **Deno 2.0+** — [deno.land/install](https://docs.deno.com/runtime/getting_started/installation/)

```bash
# Verify
deno --version
# deno 2.x.x (release, ...)
```

No Node.js. No npm. No build step.

---

## 🚀 Setup

```bash
# Clone
git clone https://github.com/raihan-rifat007/YouTube-API.git
cd YouTube-API

# Cache dependencies
deno cache main.ts

# Start (dev — file watcher)
deno task dev

# Start (production)
deno task start
```

Open **http://localhost:8000**

### Environment

```bash
PORT=8000   # default
```

No `.env` file needed beyond `PORT`.

---

## 📡 API Reference

**Base:** `http://localhost:8000` (local) or your deploy URL

All success responses: `{ success: true, ... }`  
All error responses: `{ success: false, error: "..." }`

---

<details>
<summary><b>Search</b></summary>

### `GET /api/search`

| Param | Required | Description |
|---|---|---|
| `q` | ✅ | Search query |
| `filter` | ❌ | `songs` `albums` `artists` `playlists` `videos` |
| `fallback` | ❌ | `1` — also tries YouTube search if YTMusic returns nothing |

```bash
curl "http://localhost:8000/api/search?q=blinding+lights&filter=songs"
```

### `GET /api/search/suggestions`

| Param | Required |
|---|---|
| `q` | ✅ |

### `GET /api/yt_search`

| Param | Required |
|---|---|
| `q` | ✅ |

</details>

---

<details>
<summary><b>Content</b></summary>

### `GET /api/songs/:videoId`
### `GET /api/albums/:browseId`
### `GET /api/artists/:browseId`
### `GET /api/playlists/:playlistId`

</details>

---

<details>
<summary><b>Discovery</b></summary>

### `GET /api/home` — YouTube Music home feed
### `GET /api/charts?country=BD` — Top charts (ISO country or `ZZ` = global)
### `GET /api/related/:videoId` — Related tracks
### `GET /api/radio?videoId=...` — Station seed
### `GET /api/moods` — Mood/genre categories
### `GET /api/trending?country=BD`

</details>

---

<details>
<summary><b>Streaming & Download</b></summary>

### `GET /api/stream?id=VIDEO_ID`

Returns audio stream URLs from Piped/Invidious for browser playback.

```json
{
  "success": true,
  "service": "piped",
  "streamingUrls": [
    { "url": "https://...", "mimeType": "audio/webm", "bitrate": 160000 }
  ]
}
```

---

### `GET /api/download?id=VIDEO_ID&title=Song+Name` ⭐ Fixed

Returns **HTTP 302** redirect to a working audio URL.  
The client (`fetchBlob`) follows the redirect, loads as blob, saves with correct filename.

| Layer | Source | Format |
|---|---|---|
| 1 | cobalt.tools | MP3 |
| 2 | Piped | WebM/Opus |
| 3 | Invidious `/latest_version?itag=140` | M4A |

On total failure → `503 JSON` (never saved as a file by the client).

---

### `GET /api/proxy?url=AUDIO_URL`

CORS proxy with `Range` support for audio seeking.

---

### `GET /api/music/find?name=Song&artist=Artist`

Fuzzy-matches a song across YouTube Music search results.

</details>

---

<details>
<summary><b>Info / Metadata</b></summary>

### `GET /api/lyrics?title=...&artist=...`

```json
{
  "success": true,
  "syncedLyrics": "[00:14.32]Line one\n...",
  "plainLyrics": "Line one\n..."
}
```

### `GET /api/artist/info?artist=...` — Last.fm bio + stats
### `GET /api/track/info?title=...&artist=...` — Last.fm track wiki

</details>

---

<details>
<summary><b>Utility</b></summary>

### `GET /health`

```json
{ "status": "ok", "version": "7.0.0" }
```

</details>

---

## 🖥 UI Features

| Feature | Details |
|---|---|
| **Liquid glass design** | `backdrop-filter` blur on sidebar, cards, player, header |
| **Grid / List toggle** | Switch between card grid and compact list; remembers per-session |
| **HQ thumbnails** | Uses highest-res thumbnail from API; falls back `hqdefault → mqdefault` |
| **Type badges** | Blue=Song · Purple=Album · Green=Artist · Orange=Playlist · Red=Video |
| **MP3 download** | fetch+blob ensures correct `.mp3` filename every time |
| **Mini player** | Fixed bottom bar: thumbnail, title, progress, volume, shuffle, repeat |
| **Expanded player** | Full-screen: album art, synced rolling lyrics, queue, related tracks |
| **Discover tab** | Home feed sections + chart lists |
| **API Docs tab** | Interactive endpoint explorer built into the UI |
| **Liked songs** | Sidebar panel; persists per-session |

---

## 🏗 Architecture

```
Browser
  │
  └─ fetch('/api/download') → 302 redirect → audio URL
       └─ blob() + createObjectURL() → a.download="Song.mp3" → Save ✓

Deno.serve (main.ts)
  ├── /                     ui.ts → ui.html
  ├── /api/search           routes/search.ts
  │     └── services/ytmusic.ts (InnerTube)
  ├── /api/songs|albums|artists|playlists
  │     └── routes/content.ts → services/entities.ts
  ├── /api/home|charts|related|radio|moods|trending
  │     └── routes/discover.ts → services/discovery.ts
  ├── /api/stream           routes/stream.ts
  │     └── services/streaming.ts (Piped + Invidious rotation)
  ├── /api/download         routes/stream.ts
  │     ├── tryCobalt()     → cobalt.tools POST → 302
  │     ├── tryPipedUrl()   → Piped best stream → 302
  │     └── tryInvidiousUrl() → /latest_version → 302
  ├── /api/proxy            routes/stream.ts (CORS + Range)
  ├── /api/lyrics           routes/info.ts → services/lyrics.ts (LRCLib)
  ├── /api/artist/info      routes/info.ts → services/lastfm.ts
  └── /health               { status: "ok" }
```

---

## ☁️ Deployment

### Deno Deploy (recommended — free tier available)

```bash
# Install deployctl
deno install -gArf jsr:@deno/deployctl

# Deploy from local
deployctl deploy --project=youtube-api main.ts

# Or link the GitHub repo in dash.deno.com → auto-deploys on push
```

### Railway

```bash
# In Railway dashboard:
# Build command: (leave blank)
# Start command: deno task start
# Add env: PORT = $PORT
```

### Docker

```dockerfile
FROM denoland/deno:2.0.0
WORKDIR /app
COPY . .
RUN deno cache main.ts
EXPOSE 8000
CMD ["deno", "task", "start"]
```

```bash
docker build -t ytmusic-api . && docker run -p 8000:8000 ytmusic-api
```

### Fly.io

```toml
# fly.toml
app = "ytmusic-api"
primary_region = "sin"

[build]
  dockerfile = "Dockerfile"

[[services]]
  internal_port = 8000
  protocol = "tcp"
  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

---

## 🛠 Troubleshooting

<details>
<summary><b>Download saves as .json or says "Failed — No file"</b></summary>

The server-side fix is in `src/routes/stream.ts`. The UI fix is in `ui.html` (`fetchBlob` function).  
Make sure both files are updated. The old anchor-click approach is completely replaced.

</details>

<details>
<summary><b>cobalt.tools not working</b></summary>

cobalt.tools is a free public service — it can be rate-limited or temporarily down. The download handler automatically falls through to Piped then Invidious. If all three fail, try again in a few minutes.

To check cobalt manually:
```bash
curl -X POST https://api.cobalt.tools/ \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","downloadMode":"audio","audioFormat":"mp3"}'
```

</details>

<details>
<summary><b>Piped / Invidious instances failing</b></summary>

These are volunteer-run instances with no SLA. The `streaming.ts` service rotates through a list automatically. You can add more working instances to the arrays in `src/services/streaming.ts`.

Public instance lists:
- Piped: https://piped.video/instances
- Invidious: https://api.invidious.io/instances.json

</details>

<details>
<summary><b>`deno: command not found`</b></summary>

```bash
curl -fsSL https://deno.land/install.sh | sh
# Then reload shell: source ~/.bashrc or source ~/.zshrc
```

</details>

<details>
<summary><b>Port already in use</b></summary>

```bash
PORT=8001 deno task start
```

</details>

---

## 🤝 Contributing

```bash
# Fork → clone
git clone https://github.com/your-fork/YouTube-API.git
cd YouTube-API

# Branch
git checkout -b feat/your-feature

# Lint + format (required before PR)
deno lint
deno fmt

# Commit — use Conventional Commits
git commit -m "feat: add new endpoint"

# Push + open PR against main
git push origin feat/your-feature
```

---

<div align="center">

**Built with Deno · TypeScript · No API keys · Deploys anywhere**

Made by [raihan07](mailto:raihanrifat9721@gmail.com) — [@raihan-rifat007](https://github.com/raihan-rifat007)

</div>
