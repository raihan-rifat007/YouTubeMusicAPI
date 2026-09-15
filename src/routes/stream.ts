import { json, error, corsHeaders } from "../helpers/response.ts";
import { fetchFromPiped, fetchFromInvidious } from "../services/streaming.ts";
import type { YTMusic } from "../services/ytmusic.ts";

export async function handleStream(searchParams: URLSearchParams): Promise<Response> {
  const id = searchParams.get("id");
  if (!id) return error("Please provide a video ID to fetch streaming URLs.");
  const piped = await fetchFromPiped(id);
  if (piped.success) return json({ success: true, service: "piped", instance: piped.instance, streamingUrls: piped.streamingUrls, metadata: piped.metadata, requestedId: id, timestamp: new Date().toISOString() });
  const invidious = await fetchFromInvidious(id);
  if (invidious.success) return json({ success: true, service: "invidious", instance: invidious.instance, streamingUrls: invidious.streamingUrls, metadata: invidious.metadata, requestedId: id, timestamp: new Date().toISOString() });
  return json({ success: false, error: "Unable to fetch streaming data. Please check the video ID and try again." }, 404);
}

export async function handleDownload(searchParams: URLSearchParams): Promise<Response> {
  const id = searchParams.get("id");
  const title = searchParams.get("title") || "audio";
  if (!id) return error("Please provide a video ID to download.");

  const safeTitle = title.replace(/[^a-zA-Z0-9\s\-_]/g, "").trim().substring(0, 100) || "audio";

  // ── PRIMARY: cobalt.tools → real MP3 ─────────────────────────────────────
  // ROOT CAUSE OF BUG: When Piped/Invidious instances fail they return JSON
  // error bodies. The old code piped that JSON body to the client with
  // Content-Type still set to audio/webm — browser saved a .webm file that
  // was actually JSON text. cobalt.tools gives a proper MP3 stream URL and
  // we validate Content-Type before piping.
  try {
    const cobaltRes = await fetch("https://api.cobalt.tools/", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${id}`,
        downloadMode: "audio",
        audioFormat: "mp3",
        filenameStyle: "basic",
      }),
    });

    if (cobaltRes.ok) {
      const cobaltData = await cobaltRes.json();
      if (cobaltData.url) {
        const mp3Res = await fetch(cobaltData.url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        if (mp3Res.ok) {
          const ct = mp3Res.headers.get("Content-Type") || "";
          if (!ct.includes("application/json") && !ct.includes("text/html")) {
            const respHeaders = new Headers({
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "audio/mpeg",
              "Content-Disposition": `attachment; filename="${safeTitle}.mp3"`,
              "Cache-Control": "public, max-age=3600",
            });
            const cl = mp3Res.headers.get("Content-Length");
            if (cl) respHeaders.set("Content-Length", cl);
            return new Response(mp3Res.body, { status: 200, headers: respHeaders });
          }
        }
      }
    }
  } catch {
    // cobalt.tools unreachable — fall through to piped/invidious
  }

  // ── FALLBACK: Piped / Invidious ───────────────────────────────────────────
  let streamData: any = null;
  const piped = await fetchFromPiped(id);
  if (piped.success && piped.streamingUrls?.length) {
    streamData = piped;
  } else {
    const invidious = await fetchFromInvidious(id);
    if (invidious.success && invidious.streamingUrls?.length) streamData = invidious;
  }

  if (!streamData) {
    return json({ success: false, error: "Unable to find audio stream. Please try again later." }, 404);
  }

  const urls: any[] = streamData.streamingUrls;
  const best = urls.reduce((a: any, b: any) => ((b.bitrate || 0) > (a.bitrate || 0) ? b : a), urls[0]);
  const audioUrl = best.url || best.directUrl;
  if (!audioUrl) return json({ success: false, error: "No direct audio URL available." }, 404);

  try {
    const audioRes = await fetch(audioUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://www.youtube.com/",
        "Origin": "https://www.youtube.com",
      },
    });

    if (!audioRes.ok) {
      return json({ success: false, error: `Stream fetch failed: ${audioRes.status}` }, 502);
    }

    const ct = audioRes.headers.get("Content-Type") || "";

    // CRITICAL: Never pipe a JSON/HTML error response as an audio file
    if (ct.includes("application/json") || ct.includes("text/html")) {
      return json({ success: false, error: "Stream provider returned a non-audio response. Please try again." }, 502);
    }

    const ext = ct.includes("mp4") ? "m4a" : ct.includes("mpeg") ? "mp3" : "webm";

    const headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Content-Type": ct || "audio/webm",
      "Content-Disposition": `attachment; filename="${safeTitle}.${ext}"`,
      "Cache-Control": "public, max-age=3600",
    });
    const cl = audioRes.headers.get("Content-Length");
    if (cl) headers.set("Content-Length", cl);

    return new Response(audioRes.body, { status: 200, headers });
  } catch {
    return json({ success: false, error: "Download failed. Please try again." }, 502);
  }
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
    const responseHeaders = new Headers();
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "Range, Content-Type");
    responseHeaders.set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges");
    responseHeaders.set("Cache-Control", "public, max-age=3600");
    responseHeaders.set("Content-Type", response.headers.get("Content-Type") || "audio/mp4");
    if (response.headers.get("Content-Length")) responseHeaders.set("Content-Length", response.headers.get("Content-Length")!);
    if (response.headers.get("Content-Range")) responseHeaders.set("Content-Range", response.headers.get("Content-Range")!);
    responseHeaders.set("Accept-Ranges", response.headers.get("Accept-Ranges") || "bytes");
    return new Response(response.body, { status: response.status, headers: responseHeaders });
  } catch {
    return new Response("Proxy error: Unable to fetch audio stream.", { status: 502, headers: corsHeaders });
  }
}

export async function handleMusicFind(searchParams: URLSearchParams, ytmusic: YTMusic): Promise<Response> {
  const name = searchParams.get("name");
  const artist = searchParams.get("artist");
  if (!name || !artist) return error("Please provide both song name and artist to find the track.");
  const searchResults = await ytmusic.search(`${name} ${artist}`, "songs");
  if (!searchResults.results?.length) return json({ success: false, error: "No matching song found. Please check the song name and artist." }, 404);
  const normalize = (s: string) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "").toLowerCase();
  const nName = normalize(name);
  const artistsList = artist.split(",").map((a: string) => normalize(a));
  const match = searchResults.results.find((song: any) => {
    const nSongName = normalize(song.title || "");
    const songArtists = (song.artists || []).map((a: any) => normalize(a.name || ""));
    return (nSongName.includes(nName) || nName.includes(nSongName)) && artistsList.some((a: string) => songArtists.some((sa: string) => sa.includes(a) || a.includes(sa)));
  });
  if (match) return json({ success: true, data: match });
  return json({ success: false, error: "Could not find the requested song. Please try with a different query." }, 404);
}
