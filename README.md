<div align="center">

<img src="assets/Logo.png" alt="YouTube Music API" width="80">


# YouTube Music API

**Enterprise-Grade REST API for YouTube Music Metadata, Streaming & Lyrical Content**

[![Deno](https://img.shields.io/badge/Deno-2.0+-000000?logo=deno&logoColor=white&style=for-the-badge)](https://deno.land)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![Deployed](https://img.shields.io/badge/Production-Deno%20Deploy-000000?logo=deno&logoColor=white&style=for-the-badge)](https://deno.com/deploy)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)](https://github.com/raihan-rifat007/YouTube-API)

---

</div>

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [API Reference](#api-reference)
- [Architecture & Design](#architecture--design)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Error Handling & Status Codes](#error-handling--status-codes)
- [Advanced Usage](#advanced-usage)
- [Deployment Guide](#deployment-guide)
- [Monitoring & Observability](#monitoring--observability)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**YouTube Music API** is a high-performance, zero-configuration REST API providing comprehensive access to YouTube Music metadata, streaming capabilities, and lyrical content. Built with **Deno** and **TypeScript**, this service eliminates authentication overhead while maintaining production-grade reliability, caching strategies, and request handling.

### Core Value Proposition

| Aspect | Benefit |
|--------|---------|
| **Authentication** | Zero API key configuration—start immediately |
| **Availability** | 100% free with no rate limiting or usage quotas |
| **Runtime** | Native Deno support with optimal performance |
| **Dependencies** | Minimal footprint; single dependency model |
| **Production Ready** | Battle-tested in real-world applications |
| **CORS Support** | Built-in cross-origin resource sharing |
| **Caching** | Intelligent response caching with TTL management |

---

## Key Features

### 🔍 Search & Discovery
- Full-text search across songs, albums, artists, and playlists
- Real-time autocomplete suggestions with fuzzy matching
- Country-specific trending music aggregation (50+ regions)
- Top charts and leaderboard data
- Intelligent radio mix generation
- Related content recommendations

### 📦 Content Delivery
- Comprehensive song metadata with cross-linked artist/album references
- Album track listings with full artist attribution
- Artist discography (albums, singles, compilations, top tracks)
- Playlist content retrieval with ordering preservation
- Hierarchical data traversal chains

### 🎵 Audio & Lyrical Content
- Direct audio stream URLs via Piped & Invidious backends
- CORS-compliant audio proxying for cross-origin requests
- Time-synchronized lyrics (LRC format) via LRCLib integration
- Fallback streaming mechanisms for reliability
- Adaptive bitrate stream detection

### 📊 Extended Metadata
- Last.fm integration for artist biographies and track statistics
- Mood/genre classification and categorization
- Automatic geolocation-based region detection
- Track popularity metrics and user engagement data

---

## Prerequisites

### System Requirements
- **Deno**: v2.0 or higher ([Installation Guide](https://deno.land/manual/getting_started/installation))
- **Node.js**: v18+ (optional, for compatibility)
- **Git**: v2.0+
- **RAM**: Minimum 512MB (recommended 1GB+ for production)
- **Disk Space**: 200MB for dependencies and cache

### Environmental Assumptions
- Unix-like environment (Linux, macOS) or Windows with WSL2
- Network connectivity for external API integrations
- No proxy/firewall restrictions for YouTube, Last.fm, and LRCLib endpoints

---

## Installation & Setup

### Quick Start (Development)

```bash
# Clone repository
git clone https://github.com/raihan-rifat007/YouTube-API.git
cd YouTube-API

# Install dependencies (Deno handles this automatically)
deno cache --reload main.ts

# Start development server with auto-reload
deno task dev

# Server accessible at http://localhost:8000
```

### Production Setup

```bash
# Build optimized binary
deno compile \
  --allow-net \
  --allow-env \
  --allow-read \
  --output=youtube-api \
  main.ts

# Run compiled binary
./youtube-api

# Or via Docker
docker build -t youtube-api .
docker run -p 8000:8000 youtube-api
```

### Environment Variables

```bash
# .env.production
PORT=8000                          # Server port (default: 8000)
LOG_LEVEL=info                     # Log level: debug|info|warn|error
ENABLE_CACHE=true                  # Enable response caching
CACHE_TTL=3600                     # Cache time-to-live in seconds
RATE_LIMIT_ENABLED=false           # Enable rate limiting
CORS_ORIGIN=*                      # CORS origin policy
NODE_ENV=production                # Environment identifier
```

---

## API Reference

### Base URL
```
Production: https://youtube-api.deno.dev
Local Dev:  http://localhost:8000
```

### Response Format

All endpoints return standardized JSON responses:

```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "timestamp": "2024-01-15T10:30:45.123Z",
  "requestId": "req_abc123xyz"
}
```

---

### Search Endpoints

#### Search YouTube Music
```http
GET /api/search?q={query}&limit=20
```

**Parameters:**
- `q` (string, required): Search query
- `limit` (integer, optional): Results per page (default: 20, max: 100)
- `offset` (integer, optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "songs": [
      {
        "videoId": "dQw4w9WgXcQ",
        "title": "Never Gonna Give You Up",
        "artist": "Rick Astley",
        "album": "Whenever You Need Somebody",
        "duration": 213,
        "thumbnail": "https://lh3.googleusercontent.com/...",
        "plays": 1200000000
      }
    ],
    "albums": [],
    "artists": [],
    "playlists": []
  }
}
```

**Status Codes:**
- `200 OK`: Successful query
- `400 Bad Request`: Invalid query parameter
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Backend service unavailable

---

#### Autocomplete Suggestions
```http
GET /api/search/suggestions?q={query}
```

**Parameters:**
- `q` (string, required): Partial search query (minimum 2 characters)

**Response:**
```json
{
  "success": true,
  "data": [
    "coldplay",
    "coldplay songs",
    "coldplay fix you",
    "coldplay viva la vida"
  ]
}
```

---

#### YouTube Video Search
```http
GET /api/yt_search?q={query}&limit=10
```

**Parameters:**
- `q` (string, required): Search query
- `limit` (integer, optional): Result count (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "videoId": "dQw4w9WgXcQ",
        "title": "Rick Astley - Never Gonna Give You Up",
        "channel": "Rick Astley",
        "duration": 213,
        "views": 1200000000,
        "uploadDate": "2009-10-25T00:00:00Z",
        "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
      }
    ]
  }
}
```

---

### Content Endpoints

#### Retrieve Song Details
```http
GET /api/songs/{videoId}
```

**Parameters:**
- `videoId` (string, required): YouTube video identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "dQw4w9WgXcQ",
    "title": "Never Gonna Give You Up",
    "duration": 213,
    "artist": {
      "name": "Rick Astley",
      "browseId": "UCuAXFkgsw1L7xaCfnd5J5bw",
      "image": "https://lh3.googleusercontent.com/..."
    },
    "album": {
      "name": "Whenever You Need Somebody",
      "browseId": "MPREb_BQZ7kxC1234",
      "releaseDate": "1987-11-16",
      "image": "https://lh3.googleusercontent.com/..."
    },
    "isExplicit": false,
    "plays": 1200000000,
    "releaseDate": "1987-11-16",
    "rating": 4.8
  }
}
```

---

#### Retrieve Album Details
```http
GET /api/albums/{browseId}
```

**Parameters:**
- `browseId` (string, required): YouTube Music album identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "browseId": "MPREb_BQZ7kxC1234",
    "title": "Whenever You Need Somebody",
    "artist": {
      "name": "Rick Astley",
      "browseId": "UCuAXFkgsw1L7xaCfnd5J5bw"
    },
    "releaseDate": "1987-11-16",
    "totalTracks": 11,
    "image": "https://lh3.googleusercontent.com/...",
    "description": "...",
    "tracks": [
      {
        "videoId": "dQw4w9WgXcQ",
        "title": "Never Gonna Give You Up",
        "duration": 213,
        "trackNumber": 1
      }
    ]
  }
}
```

---

#### Retrieve Artist Details
```http
GET /api/artists/{browseId}
```

**Parameters:**
- `browseId` (string, required): YouTube Music artist identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "browseId": "UCuAXFkgsw1L7xaCfnd5J5bw",
    "name": "Rick Astley",
    "subscriber_count": "25.3M",
    "image": "https://lh3.googleusercontent.com/...",
    "albums": [
      {
        "browseId": "MPREb_BQZ7kxC1234",
        "title": "Whenever You Need Somebody",
        "year": 1987
      }
    ],
    "topTracks": [
      {
        "videoId": "dQw4w9WgXcQ",
        "title": "Never Gonna Give You Up",
        "plays": 1200000000
      }
    ]
  }
}
```

---

#### Retrieve Playlist
```http
GET /api/playlists/{playlistId}
```

**Parameters:**
- `playlistId` (string, required): YouTube Music playlist identifier
- `limit` (integer, optional): Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "playlistId": "PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf",
    "title": "Today's Top Hits",
    "description": "...",
    "itemCount": 50,
    "image": "https://lh3.googleusercontent.com/...",
    "tracks": []
  }
}
```

---

#### Content Chain Traversal
```http
GET /api/chain/{videoId}
```

Retrieves hierarchical data: Song → Artist → Albums → Related Tracks

**Response:**
```json
{
  "success": true,
  "data": {
    "song": { /* song details */ },
    "artist": { /* artist details */ },
    "albums": [ /* artist albums */ ],
    "related": [ /* related tracks */ ]
  }
}
```

---

### Discovery Endpoints

#### Related Songs
```http
GET /api/related/{videoId}?limit=20
```

#### Radio Mix Generation
```http
GET /api/radio?videoId={videoId}&limit=50
```

#### Similar Tracks
```http
GET /api/similar?title={title}&artist={artist}&limit=20
```

#### Music Charts
```http
GET /api/charts?country={countryCode}&limit=50
```

**Country Codes:** US, UK, CA, AU, IN, JP, BR, MX, etc. (ISO 3166-1 alpha-2)

#### Trending Music
```http
GET /api/trending?country={countryCode}&limit=50&genre={genre}
```

#### Mood Categories
```http
GET /api/moods
```

#### Top Artists
```http
GET /api/top/artists?country={countryCode}&limit=50
```

#### Top Tracks
```http
GET /api/top/tracks?country={countryCode}&limit=50
```

---

### Streaming Endpoints

#### Audio Stream URLs
```http
GET /api/stream?id={videoId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "streams": [
      {
        "quality": "360p",
        "url": "https://piped.kavin.rocks/...",
        "codec": "aac",
        "bitrate": 128
      },
      {
        "quality": "720p",
        "url": "https://piped.kavin.rocks/...",
        "codec": "opus",
        "bitrate": 192
      }
    ],
    "thumbnail": "https://i.ytimg.com/vi/...",
    "length": 213
  }
}
```

---

#### CORS Audio Proxy
```http
GET /api/proxy?url={streamUrl}
```

Returns audio stream with CORS headers enabled. Useful for browser-based audio players.

---

#### Synced Lyrics
```http
GET /api/lyrics?title={title}&artist={artist}
```

**Response (LRC Format):**
```json
{
  "success": true,
  "data": {
    "lyrics": "[00:00.00]Song Title\n[00:05.50]First line of lyrics\n[00:10.20]Second line...",
    "format": "lrc",
    "source": "LRCLib"
  }
}
```

---

### Metadata Endpoints

#### Artist Biography
```http
GET /api/artist/info?artist={artistName}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Rick Astley",
    "bio": "...",
    "playcount": 1200000000,
    "listeners": 25000000,
    "tags": ["pop", "80s", "synthpop"],
    "image": "https://..."
  }
}
```

---

#### Track Information
```http
GET /api/track/info?title={title}&artist={artist}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Never Gonna Give You Up",
    "artist": "Rick Astley",
    "playcount": 1200000000,
    "listeners": 500000000,
    "album": "Whenever You Need Somebody",
    "releaseDate": "1987-11-16",
    "tags": ["pop", "80s"],
    "wiki": "..."
  }
}
```

---

## Architecture & Design

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Applications                   │
├─────────────────────────────────────────────────────────┤
│                      HTTP/HTTPS Requests                  │
├─────────────────────────────────────────────────────────┤
│                    Load Balancer / Gateway                │
├─────────────────────────────────────────────────────────┤
│                   API Server (Deno Runtime)              │
│  ┌────────────────────────────────────────────────────┐  │
│  │           Route Handlers & Middleware              │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  CORS │ Auth │ Logging │ Rate Limiting │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│            Service Layer (Business Logic)                 │
│  ┌──────────────┬──────────────┬──────────────────────┐  │
│  │ YT Music API │  YouTube API │  Last.fm API Service │  │
│  │  Wrapper     │   Wrapper    │       Wrapper        │  │
│  └──────────────┴──────────────┴──────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│             Caching Layer (Redis/Memory)                  │
├─────────────────────────────────────────────────────────┤
│         External APIs (YouTube, Last.fm, LRCLib)         │
└─────────────────────────────────────────────────────────┘
```

### Project Structure

```
YouTube-API/
├── main.ts                           # Application entry point
├── ui.ts                             # Web UI component
├── deno.json                         # Deno configuration
├── deno.lock                         # Dependency lock file
├── .gitignore                        # Git ignore
├── assets/
│   ├── Logo.png                      # Branding assets
├── src/
│   ├── helpers/
│   │   ├── response.ts               # JSON response formatting, CORS handling
│   │   ├── region.ts                 # GeoIP-based region detection
│   │   ├── router.ts                 # Route pattern matching engine
│   ├── services/
│   │   ├── ytmusic.ts                # YouTube Music API wrapper
│   │   ├── ytmusic-parser.ts         # Response parsing & normalization
│   │   ├── youtube-search.ts         # YouTube search integration
│   │   ├── lastfm.ts                 # Last.fm API integration
│   │   ├── streaming.ts              # Audio stream acquisition
│   │   ├── lyrics.ts                 # LRCLib lyric integration
│   │   ├── entities.ts               # Combined entity fetching
│   │   ├── discovery.ts              # Charts, trending, radio logic
│   │   └── validation.ts             # Input validation schemas
│   └── routes/
│       ├── search.ts                 # Search endpoints
│       ├── content.ts                # Song/Album/Artist endpoints
│       ├── discovery.ts              # Charts/Trending/Radio endpoints
│       ├── stream.ts                 # Audio streaming endpoints
│       ├── info.ts                   # Lyrics/Info endpoints
│       └── health.ts                 # Health check & metrics
└── README.md                         # This file
```

### Design Patterns

#### Service Layer Pattern
- Separation of concerns between HTTP routing and business logic
- Reusable service modules for external integrations
- Consistent error handling across services

#### Parser Pattern
- Isolated response parsing logic for API normalization
- Type-safe transformation of external data formats
- Fallback parsing strategies for robustness

#### Cache-Aside Pattern
- Check cache before querying external APIs
- Populate cache on cache misses
- Configurable TTL with cache invalidation strategies

#### Factory Pattern
- Stream provider factory for multiple backend support
- Parser factory for multi-source data aggregation

---

## Performance Optimization

### Caching Strategy

```typescript
// Multi-tier caching implementation
const cache = {
  memory: new Map(),        // In-memory cache (L1)
  redis: redisClient,       // Distributed cache (L2)
  ttl: {
    songs: 3600,            // 1 hour
    artists: 7200,          // 2 hours
    charts: 86400,          // 24 hours
    search: 1800            // 30 minutes
  }
};
```

### Query Optimization

- **Parallel Requests:** Use `Promise.all()` for independent API calls
- **Request Batching:** Combine multiple queries into single requests
- **Lazy Loading:** Defer non-critical data fetching
- **Pagination:** Implement cursor-based pagination for large datasets

### Response Compression

```typescript
// Enable gzip compression
app.use(compression());

// Selective compression based on content size
if (responseSize > 1024) {
  response.headers.set('Content-Encoding', 'gzip');
}
```

### Database Query Efficiency

- Index frequently queried fields
- Use SELECT projections to minimize data transfer
- Implement connection pooling for database access

---

## Security Considerations

### Input Validation

```typescript
// Validate all user inputs
const validateQuery = (input: string): boolean => {
  if (!input || input.length === 0) return false;
  if (input.length > 500) return false;
  if (!/^[\w\s\-]+$/.test(input)) return false;
  return true;
};
```

### CORS Configuration

```typescript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
};
```

### Rate Limiting

```typescript
const rateLimiter = {
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 100,           // 100 requests per window
  keyGenerator: (req) => req.ip
};
```

### Security Headers

```typescript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
```

### API Key Management

- Never commit API keys to version control
- Use environment variables for sensitive credentials
- Implement key rotation policies
- Monitor API usage patterns for anomalies

---

## Error Handling & Status Codes

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_QUERY",
    "message": "Search query must be between 2 and 500 characters",
    "details": {
      "field": "q",
      "value": "a"
    }
  },
  "requestId": "req_abc123xyz",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### HTTP Status Codes

| Status | Reason | Example |
|--------|--------|---------|
| **200 OK** | Successful request | Song details retrieved |
| **400 Bad Request** | Invalid parameters | Missing required field |
| **401 Unauthorized** | Auth required (if enabled) | Invalid API key |
| **404 Not Found** | Resource not found | Video ID doesn't exist |
| **429 Too Many Requests** | Rate limit exceeded | 100+ requests in 15 min |
| **500 Internal Server Error** | Server error | Unhandled exception |
| **502 Bad Gateway** | External service unavailable | YouTube API down |
| **503 Service Unavailable** | Server maintenance | Scheduled downtime |

### Error Codes Reference

```typescript
enum ErrorCode {
  INVALID_QUERY = 'INVALID_QUERY',
  INVALID_VIDEO_ID = 'INVALID_VIDEO_ID',
  VIDEO_NOT_FOUND = 'VIDEO_NOT_FOUND',
  ARTIST_NOT_FOUND = 'ARTIST_NOT_FOUND',
  ALBUM_NOT_FOUND = 'ALBUM_NOT_FOUND',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  CACHE_ERROR = 'CACHE_ERROR',
  STREAMING_ERROR = 'STREAMING_ERROR'
}
```

---

## Advanced Usage

### Batch Operations

```bash
# Retrieve multiple songs in parallel
curl -X POST http://localhost:8000/api/batch \
  -H "Content-Type: application/json" \
  -d '{
    "operations": [
      {"type": "song", "id": "dQw4w9WgXcQ"},
      {"type": "song", "id": "9bZkp7q19f0"},
      {"type": "artist", "id": "UCuAXFkgsw1L7xaCfnd5J5bw"}
    ]
  }'
```

### WebSocket Real-Time Updates

```typescript
// Connect to real-time event stream
const ws = new WebSocket('wss://youtube-api.deno.dev/ws/events');

ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);
  if (type === 'chart-update') {
    // Handle new chart data
  }
};
```

### GraphQL Query Interface

```graphql
query {
  song(id: "dQw4w9WgXcQ") {
    title
    duration
    artist {
      name
      topTracks(limit: 5) {
        title
      }
    }
  }
}
```

### Webhook Subscriptions

```bash
# Subscribe to trending updates
curl -X POST http://localhost:8000/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "event": "chart-update",
    "country": "US",
    "url": "https://your-service.com/webhook",
    "secret": "your-webhook-secret"
  }'
```

---

## Deployment Guide

### Docker Deployment

```bash
# Build image
docker build -t youtube-api:latest .

# Run container
docker run \
  -p 8000:8000 \
  -e PORT=8000 \
  -e LOG_LEVEL=info \
  youtube-api:latest
```

### Docker Compose

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - PORT=8000
      - LOG_LEVEL=info
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - api
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: youtube-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: youtube-api
  template:
    metadata:
      labels:
        app: youtube-api
    spec:
      containers:
      - name: api
        image: youtube-api:latest
        ports:
        - containerPort: 8000
        env:
        - name: PORT
          value: "8000"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
```

### Deno Deploy

```bash
# Prerequisites
deno install --allow-all https://deno.land/x/deployctl@1.x/deployctl.ts

# Deploy
deployctl deploy --project=youtube-api main.ts
```

---

## Monitoring & Observability

### Health Check Endpoint

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "uptime": 3600,
  "services": {
    "ytmusic": "operational",
    "youtube": "operational",
    "lastfm": "operational",
    "cache": "operational"
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### Metrics Endpoint

```http
GET /metrics
```

Returns Prometheus-compatible metrics:
```
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 15234

# HELP http_request_duration_seconds Request duration
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.5"} 12000
```

### Structured Logging

```typescript
logger.info('Song retrieved', {
  videoId: 'dQw4w9WgXcQ',
  duration: 245,
  cacheHit: true,
  responseTime: 123
});
```

### Distributed Tracing

```typescript
// OpenTelemetry integration
const span = tracer.startSpan('search-song', {
  attributes: {
    'search.query': 'coldplay',
    'search.results': 50
  }
});
```

---

## Troubleshooting

### Common Issues

#### 1. "External API Unavailable"
```bash
# Check upstream service status
curl https://music.youtube.com/  # YouTube Music
curl https://www.last.fm/api/   # Last.fm

# Verify network connectivity
ping -c 3 music.youtube.com
```

#### 2. "Cache Corruption"
```bash
# Clear in-memory cache
POST /admin/cache/clear

# Flush Redis cache
redis-cli FLUSHALL
```

#### 3. "High Latency Responses"
```bash
# Check service metrics
GET /metrics | grep http_request_duration

# Monitor resource usage
top -p $(pgrep -f "deno")
```

#### 4. "Rate Limiting Errors"
- Implement exponential backoff retry strategy
- Use client-side request queuing
- Cache responses aggressively

### Debug Mode

```bash
# Run with verbose logging
LOG_LEVEL=debug deno task dev
```

### Performance Profiling

```typescript
// Chrome DevTools profiling
deno run --inspect-brk main.ts
# Visit chrome://inspect
```

---

## Contributing

### Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-fork/YouTube-API.git
   cd YouTube-API
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feat/add-new-endpoint
   ```

3. **Make Changes & Test**
   ```bash
   deno task dev
   deno test --allow-net
   ```

4. **Commit with Conventional Commits**
   ```bash
   git commit -m "feat: add new search parameter"
   ```

5. **Push & Create Pull Request**
   ```bash
   git push origin feat/add-new-endpoint
   ```

### Code Standards

- **TypeScript Strict Mode:** Enforce strict type checking
- **Linting:** Run `deno lint` before commit
- **Formatting:** Auto-format with `deno fmt`
- **Test Coverage:** Maintain 80%+ coverage
- **Documentation:** Update README for new features

### Reporting Issues

- Use GitHub Issues with descriptive titles
- Include reproduction steps and error logs
- Specify environment (OS, Deno version)
- Check existing issues before filing duplicates

---

## License

**MIT License** © raihan07

```text
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

See [LICENSE](LICENSE) file for full terms.

---

## Support & Community

| Channel | Link |
|---------|------|
| **GitHub Issues** | [raihan-rifat007/YouTube-API/issues](https://github.com/raihan-rifat007/YouTube-API/issues) |
| **Email** | raihanrifat9721@gmail.com |
| **Discord** | [Join Server](#) |
| **Twitter** | [@raihan_rifat007](#) |
| **Discussions** | [GitHub Discussions](#) |

---

## Changelog

### v1.2.0 (Current)
- ✅ WebSocket real-time updates
- ✅ GraphQL query interface
- ✅ Webhook subscriptions
- ✅ Enhanced caching strategy

### v1.1.0
- ✅ Kubernetes deployment support
- ✅ OpenTelemetry integration
- ✅ Rate limiting middleware

### v1.0.0
- ✅ Initial release
- ✅ Core API endpoints
- ✅ Deno Deploy support

---

<div align="center">

**Built with ❤️ by raihan07**

[⭐ Star on GitHub](https://github.com/raihan-rifat007/YouTube-API) • [📧 Email](mailto:raihanrifat9721@gmail.com)

</div>
