import { json, error, corsHeaders } from "../helpers/response.ts";
import { fetchFromPiped, fetchFromInvidious } from "../services/streaming.ts";
import type { YTMusic } from "../services/ytmusic.ts";

// ─────────────────────────────────────────────────────────────────────────────
// ROOT CAUSE OF JSON DOWNLOAD BUG
// ─────────────────────────────────────────────────────────────────────────────
// Old code path when Piped+Invidious both failed:
//   → return json({ success:false, error:"..." }, 404)      ← JSON body
//   → browser receives application/json
//   → Chrome ignores a.download extension, saves as "Song.json"
//
// Old code path when upstream returned an error page:
//   → audioRes.body piped directly (no Content-Type validation)
//   → upstream returned text/html or application/json error
//   → browser saved an HTML/JSON file named "Song.webm"
//
// FIX STRATEGY (3 layers):
//   1. cobalt.tools  → redirect 302 to MP3 tunnel URL
//   2. Piped         → redirect 302 to best audio stream URL
//   3. Invidious     → redirect 302 to /latest_version (itag=140, m4a)
//   Client (ui.html) uses fetch()+blob()+createObjectURL() so the
//   a.download="Song.mp3" filename is ALWAYS honoured regardless of CORS.
// ─────────────────────────────────────────────────────────────────────────────

const INVIDIOUS_FALLBACKS = [
  "https://y.com.sb",
  "https://inv.tux.pizza",
  "https://invidious.privacyredirect.com",
  "https://invidious.nerdvpn.de",
  "https://invidious.flokinet.to",
];

export async function handleStream(searchParams: URLSearchParams): Promise<Response> {
  const id = searchParams.get("id");
  if (!id) return error("Please provide a video ID to fetch streaming URLs.");
  const piped = await fetchFromPiped(id);
  if (piped.success) return json({ success: true, service: "piped", instance: piped.instance, streamingUrls: piped.streamingUrls, metadata: piped.metadata, requestedId: id, timestamp: new Date().toISOString() });
  const invidious = await fetchFromInvidious(id);
  if (invidious.success) return json({ success: true, service: "invidious", instance: invidious.instance, streamingUrls: invidious.streamingUrls, metadata: invidious.metadata, requestedId: id, timestamp: new Date().toISOString() });
  return json({ success: false, error: "Unable to fetch streaming data. Please check the video ID and try again." }, 404);
}

async function tryCobalt(id: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.cobalt.tools/", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${id}`,
        downloadMode: "audio",
        audioFormat: "mp3",
        filenameStyle: "basic",
      }),
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    // cobalt returns { status: "tunnel"|"redirect"|"picker"|"error", url?: string }
    if (data.url && (data.status === "tunnel" || data.status === "redirect")) return data.url;
    // picker mode: use first audio item
    if (data.status === "picker" && Array.isArray(data.picker)) {
      const audio = data.picker.find((p: any) => p.type === "audio") || data.picker[0];
      if (audio?.url) return audio.url;
    }
    return null;
  } catch {
    return null;
  }
}

async function tryPipedUrl(id: string): Promise<string | null> {
  try {
    const piped = await fetchFromPiped(id);
    if (!piped.success || !piped.streamingUrls?.length) return null;
    const urls: any[] = piped.streamingUrls;
    const best = urls
      .filter((u: any) => (u.mimeType || "").includes("audio"))
      .reduce((a: any, b: any) => ((b.bitrate || 0) > (a.bitrate || 0) ? b : a), urls[0]);
    return best?.url || best?.directUrl || null;
  } catch {
    return null;
  }
}

async function tryInvidiousUrl(id: string): Promise<string | null> {
  // itag 140 = audio/mp4 (m4a) 128kbps — most widely available
  // itag 251 = audio/webm (opus) 160kbps — better quality, try second
  const itags = [140, 251, 250];
  for (const instance of INVIDIOUS_FALLBACKS) {
    for (const itag of itags) {
      try {
        const url = `${instance}/latest_version?id=${id}&itag=${itag}&local=true`;
        const probe = await fetch(url, {
          method: "HEAD",
          signal: AbortSignal.timeout(4000),
          redirect: "follow",
        });
        const ct = probe.headers.get("Content-Type") || "";
        if (probe.ok && !ct.includes("json") && !ct.includes("html") && !ct.includes("text")) {
          return url;
        }
      } catch {
        continue;
      }
    }
  }
  return null;
}

export async function handleDownload(searchParams: URLSearchParams): Promise<Response> {
  const id = searchParams.get("id");
  const title = searchParams.get("title") || "audio";
  if (!id) return error("Please provide a video ID to download.");

  // ── Layer 1: cobalt.tools (MP3, highest quality) ──────────────────────────
  const cobaltUrl = await tryCobalt(id);
  if (cobaltUrl) {
    return new Response(null, {
      status: 302,
      headers: {
        "Location": cobaltUrl,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
    });
  }

  // ── Layer 2: Piped stream URL ─────────────────────────────────────────────
  const pipedUrl = await tryPipedUrl(id);
  if (pipedUrl) {
    return new Response(null, {
      status: 302,
      headers: {
        "Location": pipedUrl,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
    });
  }

  // ── Layer 3: Invidious /latest_version (m4a / webm fallback) ─────────────
  const invUrl = await tryInvidiousUrl(id);
  if (invUrl) {
    return new Response(null, {
      status: 302,
      headers: {
        "Location": invUrl,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
    });
  }

  // ── All sources failed ────────────────────────────────────────────────────
  // Return 503 JSON — the client (fetchBlob) catches !res.ok and shows error toast
  return json({
    success: false,
    error: "All audio sources failed. cobalt.tools, Piped, and Invidious are all unavailable right now. Please try again in a few minutes.",
  }, 503);
}

export async function handleProxy(searchParams: URLSearchParams, req: Request): Promise<Response> {
  const audioUrl = searchParams.get("url");
  if (!audioUrl) return error("Please provide a URL to proxy.");
  try {
    const headers: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "*/*",
      "Referer": "https://www.youtube.com/",
      "Origin": "https://www.youtube.com",
    };
    const rangeHeader = req.headers.get("Range");
    if (rangeHeader) headers["Range"] = rangeHeader;
    const response = await fetch(audioUrl, { headers });
    if (!response.ok && response.status !== 206) return new Response(`Proxy failed: ${response.status}`, { status: 502, headers: corsHeaders });
    const rh = new Headers();
    rh.set("Access-Control-Allow-Origin", "*");
    rh.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    rh.set("Access-Control-Allow-Headers", "Range, Content-Type");
    rh.set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges");
    rh.set("Cache-Control", "public, max-age=3600");
    rh.set("Content-Type", response.headers.get("Content-Type") || "audio/mp4");
    if (response.headers.get("Content-Length")) rh.set("Content-Length", response.headers.get("Content-Length")!);
    if (response.headers.get("Content-Range")) rh.set("Content-Range", response.headers.get("Content-Range")!);
    rh.set("Accept-Ranges", response.headers.get("Accept-Ranges") || "bytes");
    return new Response(response.body, { status: response.status, headers: rh });
  } catch {
    return new Response("Proxy error: Unable to fetch audio stream.", { status: 502, headers: corsHeaders });
  }
}

export async function handleMusicFind(searchParams: URLSearchParams, ytmusic: YTMusic): Promise<Response> {
  const name = searchParams.get("name");
  const artist = searchParams.get("artist");
  if (!name || !artist) return error("Please provide both song name and artist to find the track.");
  const searchResults = await ytmusic.search(`${name} ${artist}`, "songs");
  if (!searchResults.results?.length) return json({ success: false, error: "No matching song found." }, 404);
  const norm = (s: string) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "").toLowerCase();
  const nName = norm(name);
  const artists = artist.split(",").map((a: string) => norm(a));
  const match = searchResults.results.find((song: any) => {
    const sn = norm(song.title || "");
    const sa = (song.artists || []).map((a: any) => norm(a.name || ""));
    return (sn.includes(nName) || nName.includes(sn)) && artists.some((a: string) => sa.some((x: string) => x.includes(a) || a.includes(x)));
  });
  if (match) return json({ success: true, data: match });
  return json({ success: false, error: "Could not find the requested song." }, 404);
}
