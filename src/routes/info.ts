import { json, error } from "../helpers/response.ts";
import { getLyrics } from "../services/lyrics.ts";
import { getArtistInfo, getTrackInfo } from "../services/lastfm.ts";

export async function handleInfoRoutes(pathname: string, searchParams: URLSearchParams): Promise<Response | null> {
  if (pathname === "/api/lyrics") {
    const title = searchParams.get("title");
    const artist = searchParams.get("artist");
    if (!title || !artist) return error("Please provide both title and artist to fetch lyrics.");
    const duration = searchParams.get("duration") ? parseInt(searchParams.get("duration")!) : undefined;
    return json(await getLyrics(title, artist, duration));
  }

  if (pathname === "/api/artist/info") {
    const artist = searchParams.get("artist");
    if (!artist) return error("Please provide an artist name to fetch biography.");
    return json(await getArtistInfo(artist));
  }

  if (pathname === "/api/track/info") {
    const title = searchParams.get("title");
    const artist = searchParams.get("artist");
    if (!title || !artist) return error("Please provide both title and artist to fetch track information.");
    return json(await getTrackInfo(title, artist));
  }

  return null;
}
