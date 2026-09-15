<div align="center">

<img src="assets/Logo.png" alt="YTMusic API" width="72">

# YouTube Music API

**Zero-config REST API for YouTube Music — search, stream, lyrics, download**

[![Deno](https://img.shields.io/badge/Deno-2.0+-000000?logo=deno&logoColor=white&style=for-the-badge)](https://deno.land)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![Version](https://img.shields.io/badge/version-7.0.0-white?style=for-the-badge)](deno.json)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Download Bug — Root Cause & Fix](#download-bug--root-cause--fix)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [UI Features](#ui-features)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Overview

YouTube Music API is a **Deno 2.0 + TypeScript** REST API that wraps YouTube Music's internal endpoints. It provides search, metadata, audio streaming URLs, synced lyrics (via LRCLib), and last.fm artist data — all without an API key. A built-in web UI (`ui.html`) lets you search, play, and download tracks directly in the browser.

**Runtime:** Deno — not Node.js. Use `deno task dev` to start, not `npm run dev`.

---

## Download Bug — Root Cause & Fix

### What was happening

When the user clicked **Download**, the browser saved a file with `.webm` extension that contained **raw JSON text** instead of audio bytes.

### Root cause (in `src/routes/stream.ts`)

The download handler tried Piped then Invidious to get a streaming URL. When **both services were unavailable** (which happens often — these are volunteer-run public instances), the handler returned early with:

```typescript
// ❌ BUG — This sends a JSON body that the browser saves as the "audio" file
if (!streamData) return json({ success: false, error: "Unable to find audio stream." }, 404);
```

Even when a stream URL was found, if the upstream Piped/Invidious instance itself returned a JSON error body, the code piped that JSON straight to the client because it never validated `Content-Type` before streaming:

```typescript
// ❌ BUG — No check: audioRes might contain JSON, not audio bytes
return new Response(audioRes.body, { status: 200, headers });
```

Additionally, `ui.html` had the filename hardcoded as `.webm`:

```javascript
// ❌ BUG — Promises MP3 but downloads webm (or JSON disguised as webm)
a.download = (s.title || 'audio') + '.webm';
```

### Fix applied

`src/routes/stream.ts` — `handleDownload` now has three layers:

```
1. cobalt.tools API (primary)
   └── POST https://api.cobalt.tools/
       downloadMode: "audio", audioFormat: "mp3"
       → Returns a direct MP3 stream URL
       → Validate Content-Type is audio before piping
       → Stream to client with Content-Type: audio/mpeg

2. Piped / Invidious (fallback)
   └── Same as before BUT now validates Content-Type
       If response is application/json or text/html → reject, don't pipe

3. Hard error
   └── json({ success: false, error: "..." }, 404)
       Never piped as a "download" — client receives a proper 404
```

`ui.html` — filename fixed:

```javascript
// ✅ FIX
a.download = (s.title || 'audio') + '.mp3';
```

---

## Project Structure

```
YouTubeMusicAPI/
├── main.ts                        # Deno HTTP server entry point
├── ui.ts                          # Reads & caches ui.html for serving
├── ui.html                        # Full web UI (search, player, download)
├── deno.json                      # Tasks, name (@raihan07/youtube-api v7.0.0)
├── deno.lock                      # Dependency lockfile
├── assets/
│   └── Logo.png                   # App logo (served at /assets/Logo.png)
└── src/
    ├── helpers/
    │   ├── response.ts            # json(), error(), corsHeaders helpers
    │   ├── region.ts              # Geo/region detection helpers
    │   └── router.ts              # Route pattern matching
    ├── routes/
    │   ├── search.ts              # /api/search, /api/search/suggestions, /api/yt_search
    │   ├── content.ts             # /api/songs/:id, /api/albums/:id, /api/artists/:id, /api/playlists/:id
    │   ├── discover.ts            # /api/home, /api/charts, /api/related/:id, /api/radio, /api/moods, /api/trending
    │   ├── feed.ts                # Feed-related endpoints
    │   ├── info.ts                # /api/lyrics, /api/artist/info, /api/track/info
    │   └── stream.ts              # /api/stream, /api/download (fixed), /api/proxy, /api/music/find
    └── services/
        ├── ytmusic.ts             # YouTube Music internal API wrapper
        ├── ytmusic-parser.ts      # Response normalizer for YTMusic data
        ├── youtube-search.ts      # YouTube video search (non-Music)
        ├── streaming.ts           # Piped + Invidious stream fetchers
        ├── lyrics.ts              # LRCLib integration (synced + plain lyrics)
        ├── lastfm.ts              # Last.fm artist/track info
        ├── discovery.ts           # Charts, radio, trending logic
        └── entities.ts            # Combined entity fetching (song+artist+album)
```

---

## Prerequisites

- **Deno 2.0+** — [install guide](https://docs.deno.com/runtime/getting_started/installation/)
- No Node.js, no npm, no build step

```bash
# Check Deno version
deno --version
```

---

## Installation & Setup

```bash
# Clone
git clone https://github.com/raihan-rifat007/YouTube-API.git
cd YouTube-API

# Cache dependencies
deno cache main.ts

# Development (auto-reload on file change)
deno task dev

# Production
deno task start
```

Server runs at `http://localhost:8000` by default.

---

## Environment Variables

```bash
PORT=8000    # HTTP port (default: 8000)
```

No API keys needed. Set `PORT` in your hosting environment or a `.env` file.

---

## API Reference

### Base URL
```
Local:      http://localhost:8000
Production: https://youtube-api.deno.dev  (example)
```

All responses return JSON: `{ success: true, ... }` or `{ success: false, error: "..." }`.

---

### Search

#### `GET /api/search`
Search YouTube Music.

| Param | Type | Required | Notes |
|---|---|---|---|
| `q` | string | yes | Search query |
| `filter` | string | no | `songs`, `albums`, `artists`, `playlists`, `videos` |
| `fallback` | `1` | no | Also tries YouTube video search if YTMusic fails |

```
GET /api/search?q=coldplay&filter=songs
```

#### `GET /api/search/suggestions`
Autocomplete suggestions.

| Param | Type | Required |
|---|---|---|
| `q` | string | yes |

#### `GET /api/yt_search`
YouTube (non-Music) video search.

| Param | Type | Required |
|---|---|---|
| `q` | string | yes |

---

### Content

#### `GET /api/songs/:videoId`
Song metadata.

#### `GET /api/albums/:browseId`
Album details + track list.

#### `GET /api/artists/:browseId`
Artist page: top tracks, albums, singles.

#### `GET /api/playlists/:playlistId`
Playlist contents.

---

### Discovery

#### `GET /api/home`
YouTube Music home feed (sections with recommendations).

#### `GET /api/charts`
| Param | Type | Notes |
|---|---|---|
| `country` | string | ISO country code (default: `ZZ` = global) |

#### `GET /api/related/:videoId`
Related/recommended songs for a given track.

#### `GET /api/radio`
| Param | Type | Notes |
|---|---|---|
| `videoId` | string | Seed track |

#### `GET /api/moods`
Browse mood/genre categories.

#### `GET /api/trending`
| Param | Type | Notes |
|---|---|---|
| `country` | string | Country code |

---

### Streaming & Download

#### `GET /api/stream`
Returns audio stream URLs (from Piped/Invidious). Use these to play audio in the browser without downloading.

| Param | Type | Required |
|---|---|---|
| `id` | string | yes — YouTube video ID |

```json
{
  "success": true,
  "service": "piped",
  "streamingUrls": [
    { "url": "https://...", "quality": "160k", "mimeType": "audio/webm", "bitrate": 160000 }
  ],
  "metadata": { "id": "...", "title": "...", "thumbnail": "..." }
}
```

#### `GET /api/download` ⭐ Fixed
Downloads audio as a file. Now tries cobalt.tools first for real MP3.

| Param | Type | Required |
|---|---|---|
| `id` | string | yes — YouTube video ID |
| `title` | string | no — used for the filename |

**Response (success):**
```
Content-Type: audio/mpeg
Content-Disposition: attachment; filename="Song Title.mp3"
Body: binary audio stream
```

**Response (failure):**
```json
{ "success": false, "error": "Unable to find audio stream. Please try again later." }
```

Note: the failure case returns HTTP 404/502 and is **never** served as a download body. Previously this JSON was incorrectly streamed to the browser.

#### `GET /api/proxy`
CORS proxy for audio stream URLs. Adds proper CORS headers and supports `Range` requests for seeking.

| Param | Type | Required |
|---|---|---|
| `url` | string | yes — direct audio stream URL |

#### `GET /api/music/find`
Find a song by name + artist (useful for matching across services).

| Param | Type | Required |
|---|---|---|
| `name` | string | yes |
| `artist` | string | yes |

---

### Info

#### `GET /api/lyrics`
Synced (LRC) or plain lyrics via LRCLib.

| Param | Type | Required |
|---|---|---|
| `title` | string | yes |
| `artist` | string | yes |

```json
{
  "success": true,
  "syncedLyrics": "[00:14.32]Line one\n[00:18.00]Line two",
  "plainLyrics": "Line one\nLine two"
}
```

#### `GET /api/artist/info`
Last.fm artist biography, listener count, tags.

| Param | Type | Required |
|---|---|---|
| `artist` | string | yes |

#### `GET /api/track/info`
Last.fm track stats, wiki summary.

| Param | Type | Required |
|---|---|---|
| `title` | string | yes |
| `artist` | string | yes |

---

### Utility

#### `GET /health`
```json
{ "status": "ok", "version": "2.1.0" }
```

---

## UI Features

The built-in web UI (`ui.html`) is served at `/` and includes:

| Feature | Details |
|---|---|
| **Search** | Real-time debounced search with type filters (All / Songs / Albums / Artists / Playlists / Videos) |
| **Grid / List toggle** | Switch between card grid view and compact list view |
| **Color-coded type badges** | Blue = Song, Purple = Album, Green = Artist, Orange = Playlist, Red = Video |
| **MP3 Download** | Per-card download button — now saves real `.mp3` (fixed) |
| **Mini player** | Fixed bottom bar with thumbnail, title, progress, volume, shuffle, repeat |
| **Expanded player** | Full-screen overlay with album art, synced lyrics, queue, related tracks |
| **Discover** | Home feed and chart sections |
| **API Docs tab** | Interactive endpoint tester built into the UI |
| **Sidebar now playing** | Clickable mini card for the current track |

---

## Architecture

```
Browser / Client
      │
      ▼
main.ts  (Deno.serve — HTTP router)
      │
      ├── /                     → ui.ts → ui.html (web UI)
      ├── /api/search           → routes/search.ts → services/ytmusic.ts
      ├── /api/songs/:id        → routes/content.ts → services/entities.ts
      ├── /api/albums/:id       → routes/content.ts → services/ytmusic.ts
      ├── /api/artists/:id      → routes/content.ts → services/ytmusic.ts
      ├── /api/playlists/:id    → routes/content.ts → services/ytmusic.ts
      ├── /api/home             → routes/discover.ts → services/discovery.ts
      ├── /api/charts           → routes/discover.ts → services/discovery.ts
      ├── /api/stream           → routes/stream.ts → services/streaming.ts (Piped/Invidious)
      ├── /api/download         → routes/stream.ts → cobalt.tools → Piped/Invidious fallback
      ├── /api/proxy            → routes/stream.ts → fetch + CORS headers
      ├── /api/lyrics           → routes/info.ts → services/lyrics.ts (LRCLib)
      ├── /api/artist/info      → routes/info.ts → services/lastfm.ts
      └── /health               → { status: "ok" }
```

### Download pipeline (fixed)

```
/api/download?id=VIDEO_ID
        │
        ▼
  cobalt.tools POST
        │
   ┌────┴────┐
   │ success │ → fetch MP3 URL → validate Content-Type is audio → stream to client
   └────┬────┘
        │ fail (rate-limit, down)
        ▼
  fetchFromPiped(id) → try each Piped instance
        │
   ┌────┴────┐
   │ success │ → fetch audio URL → validate Content-Type is audio → stream
   └────┬────┘
        │ fail
        ▼
  fetchFromInvidious(id) → try each Invidious instance
        │
   ┌────┴────┐
   │ success │ → fetch audio URL → validate Content-Type is audio → stream
   └────┬────┘
        │ fail
        ▼
  json({ success: false, error: "..." }, 404)   ← NOT a download body
```

---

## Deployment

### Deno Deploy (recommended)

```bash
# Install deployctl
deno install -A jsr:@deno/deployctl

# Deploy
deployctl deploy --project=youtube-api main.ts
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
docker build -t ytmusic-api .
docker run -p 8000:8000 ytmusic-api
```

### Railway / Render / Fly.io

Set start command to:
```
deno task start
```

Set `PORT` environment variable to match the platform's expected port.

---

## Troubleshooting

### Download saves as `.webm` with JSON content
Update to the fixed `src/routes/stream.ts`. The old code piped non-audio responses to the client. The new code validates `Content-Type` before streaming and uses cobalt.tools as the primary source.

### Piped / Invidious instances failing
These are volunteer-run public instances with no SLA. The streaming service rotates through a list defined in `src/services/streaming.ts`. If all fail, cobalt.tools (the primary) takes over. To add more instances, edit the `PIPED_INSTANCES` array in `streaming.ts`.

### `deno: command not found`
Install Deno: `curl -fsSL https://deno.land/install.sh | sh`

### `--allow-net` permission error
Make sure you run via `deno task dev` or `deno task start`. These already include all required permission flags.

### Port already in use
```bash
PORT=8001 deno task start
```

---

## Contributing

```bash
# Fork & clone
git clone https://github.com/raihan-rifat007/YouTube-API.git
cd YouTube-API

# Create branch
git checkout -b feat/your-feature

# Lint & format before committing
deno lint
deno fmt

# Commit with conventional commits
git commit -m "feat: add new endpoint"

# Push & open PR
git push origin feat/your-feature
```

---

## License

MIT © [raihan07](mailto:raihanrifat9721@gmail.com)

---

<div align="center">

Built with Deno + TypeScript · No API keys · Deploys anywhere

[GitHub](https://github.com/raihan-rifat007/YouTube-API) · [Email](mailto:raihanrifat9721@gmail.com)

</div>
