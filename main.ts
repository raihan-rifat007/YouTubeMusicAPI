import { YTMusic } from "./src/services/ytmusic.ts";
import { YouTubeSearch } from "./src/services/youtube-search.ts";
import { json, corsHeaders } from "./src/helpers/response.ts";
import { getHtml } from "./ui.ts";
import { handleSearch, handleSearchSuggestions, handleYTSearch } from "./src/routes/search.ts";
import { handleContentRoutes } from "./src/routes/content.ts";
import { handleDiscoverRoutes } from "./src/routes/discover.ts";
import { handleStream, handleProxy, handleMusicFind, handleDownload } from "./src/routes/stream.ts";
import { handleInfoRoutes } from "./src/routes/info.ts";
import { handleFeedRoutes } from "./src/routes/feed.ts";

const ytmusic = new YTMusic();
const youtubeSearch = new YouTubeSearch();

function userFriendlyError(error: unknown): string {
  if (error instanceof TypeError) return "Invalid request format. Please check your parameters.";
  if (error instanceof Deno.errors.NotFound) return "The requested resource was not found.";
  if (error instanceof Deno.errors.PermissionDenied) return "Permission denied. Please check your access rights.";
  if (error instanceof Deno.errors.ConnectionRefused) return "Connection refused. The service might be temporarily unavailable.";
  if (error instanceof Deno.errors.TimedOut) return "Request timed out. Please try again later.";
  return "Something went wrong. Please try again later.";
}

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const { pathname, searchParams } = url;
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    if (pathname === "/") return new Response(getHtml(), { headers: { "Content-Type": "text/html", ...corsHeaders } });
    if (pathname === "/assets/logo.png" || pathname === "/assets/Logo.png") {
      try {
        const logoPath = new URL("./assets/Logo.png", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
        const logo = await Deno.readFile(logoPath);
        return new Response(logo, { headers: { "Content-Type": "image/png", ...corsHeaders } });
      } catch { return new Response("Logo not found", { status: 404 }); }
    }
    if (pathname === "/favicon.ico") return new Response(null, { status: 204 });
    if (pathname === "/health") return json({ status: "ok", version: "2.1.0" });
    if (pathname === "/api/search") return await handleSearch(req, searchParams, ytmusic, youtubeSearch);
    if (pathname === "/api/search/suggestions") return await handleSearchSuggestions(searchParams, ytmusic, youtubeSearch);
    if (pathname === "/api/yt_search") return await handleYTSearch(searchParams, youtubeSearch);
    const contentResponse = await handleContentRoutes(pathname, searchParams, ytmusic);
    if (contentResponse) return contentResponse;
    const discoverResponse = await handleDiscoverRoutes(pathname, searchParams, ytmusic, youtubeSearch);
    if (discoverResponse) return discoverResponse;
    if (pathname === "/api/music/find") return await handleMusicFind(searchParams, ytmusic);
    if (pathname === "/api/stream") return await handleStream(searchParams);
    if (pathname === "/api/download") return await handleDownload(searchParams);
    if (pathname === "/api/proxy") return await handleProxy(searchParams, req);
    const infoResponse = await handleInfoRoutes(pathname, searchParams);
    if (infoResponse) return infoResponse;
    const feedResponse = await handleFeedRoutes(pathname, searchParams);
    if (feedResponse) return feedResponse;
    return json({ error: `The endpoint "${pathname}" does not exist.`, path: pathname }, 404);
  } catch (err) {
    console.error("Error:", err);
    return json({ error: userFriendlyError(err) }, 500);
  }
}

const PORT = parseInt(Deno.env.get("PORT") || "8000");
console.log(`YouTube API v2.1.0 running on http://localhost:${PORT}`);
Deno.serve({ port: PORT }, handler);


