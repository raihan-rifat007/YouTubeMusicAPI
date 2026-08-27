<div align="center">

<img src="assets/Logo.png" alt="YouTube API" width="80" height="80">

# YouTube API

### Music API for YouTube Music, Lyrics & Streaming

[![Deno](https://img.shields.io/badge/Deno-2.0-000000?logo=deno&logoColor=white)](https://deno.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Deployed](https://img.shields.io/badge/Deployed_on-Deno_Deploy-000000?logo=deno&logoColor=white)](https://deno.com/deploy)
[![License](https://img.shields.io/badge/License-MIT-000000)](LICENSE)

</div>

---

## ▸ Overview

High-performance REST API for YouTube Music delivering song metadata, artist discographies, album tracks, synced lyrics, and audio streaming URLs. No API key required. Zero configuration.

---

## ▸ Quick Start

```bash
git clone https://github.com/raihan-rifat007/YouTube-API.git
cd YouTube-API
deno task start
```

Server runs at http://localhost:8000

---

▸ Why This API

▸ Feature ▸ Benefit
No API Key Required Zero setup, start immediately
100% Free No rate limits, no billing
Deno Native Built with Deno, runs everywhere
Single Dependency Minimal footprint
Production Ready Used in real applications

---

▸ Features

▸ Search & Discovery

· Search songs, albums, artists, playlists
· Autocomplete suggestions
· Trending music by country
· Top charts (50+ countries)
· Related songs & radio mixes

▸ Content Delivery

· Song metadata with artist/album links
· Album tracks with artist details
· Artist discography (albums, singles, top songs)
· Playlist tracks

▸ Audio & Lyrics

· Direct audio stream URLs (Piped/Invidious)
· CORS-proxied audio streaming
· Synced lyrics (LRC format) via LRCLib

▸ Additional Info

· Artist biography (Last.fm)
· Track information (Last.fm)
· Mood categories
· Auto region detection from IP

---

▸ API Reference

▸ Search

Method Endpoint Description
GET /api/search?q={query} Search YouTube Music
GET /api/search/suggestions?q={query} Autocomplete suggestions
GET /api/yt_search?q={query} Search YouTube videos

```bash
curl /api/search?q=coldplay
```

▸ Content

Method Endpoint Description
GET /api/songs/{videoId} Song + artist/album links
GET /api/albums/{browseId} Album + tracks + artist
GET /api/artists/{browseId} Artist + discography
GET /api/playlists/{playlistId} Playlist tracks
GET /api/chain/{videoId} Full chain: Song → Artist → Albums

```bash
curl /api/songs/dQw4w9WgXcQ
```

▸ Discovery

Method Endpoint Description
GET /api/related/{videoId} Related songs
GET /api/radio?videoId={id} Radio mix
GET /api/similar?title={title}&artist={artist} Similar tracks
GET /api/charts?country={code} Music charts by country
GET /api/trending?country={code} Trending music
GET /api/moods Mood categories
GET /api/top/artists?country={code} Top artists
GET /api/top/tracks?country={code} Top tracks

```bash
curl /api/charts?country=US
```

▸ Streaming & Lyrics

Method Endpoint Description
GET /api/stream?id={videoId} Audio stream URLs
GET /api/proxy?url={streamUrl} Audio proxy (CORS)
GET /api/lyrics?title={title}&artist={artist} Synced lyrics (LRC)

```bash
curl /api/stream?id=dQw4w9WgXcQ
```

▸ Info

Method Endpoint Description
GET /api/artist/info?artist={name} Artist bio (Last.fm)
GET /api/track/info?title={title}&artist={artist} Track info (Last.fm)

```bash
curl /api/artist/info?artist=Coldplay
```

---

▸ Architecture

```
main.ts                    Entry point (Deno.serve)
ui.ts                      Web UI HTML
assets/                    Static assets
src/
├── helpers/
│   ├── response.ts        JSON/error helpers, CORS
│   ├── region.ts          IP-based region detection
│   └── router.ts          Route pattern matching
├── services/
│   ├── ytmusic.ts         YouTube Music API client
│   ├── ytmusic-parser.ts  YT Music response parsers
│   ├── youtube-search.ts  YouTube Search (web scraping)
│   ├── lastfm.ts          Last.fm API
│   ├── streaming.ts       Piped/Invidious stream fetching
│   ├── lyrics.ts          LRCLib lyrics
│   ├── entities.ts        Combined entity fetchers
│   └── discovery.ts       Trending, radio, top charts
└── routes/
    ├── search.ts          /api/search, /api/yt_search
    ├── content.ts         /api/songs, /api/albums, /api/artists
    ├── discover.ts        /api/charts, /api/trending, /api/radio
    ├── stream.ts          /api/stream, /api/proxy
    ├── info.ts            /api/lyrics, /api/artist/info
    └── feed.ts            /api/feed/*
```

---

▸ Development

Prerequisites

· Deno (v2.0+)

Setup

```bash
git clone https://github.com/raihan-rifat007/YouTube-API.git
cd YouTube-API
deno task dev
```

Test

```bash
deno test
```

Build

```bash
deno compile --allow-net --allow-env --allow-read main.ts
```

---

▸ Deploy

Deno Deploy

```bash
deno task deploy
```

Environment Variables

Variable Description
PORT Server port (default: 8000)

Deployment URLs

```
https://youtube-api.deno.dev
```

---

▸ Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

▸ Support

Channel Link
GitHub Issues raihan-rifat007/YouTube-API/issues
Email raihan.rifat007@gmail.com

---

▸ License

MIT © raihan07

---

<div align="center">

Built with ❤ by raihan07

</div>
