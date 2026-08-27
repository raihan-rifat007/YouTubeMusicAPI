import { json, error } from "../helpers/response.ts";
import { detectRegionFromIP } from "../helpers/region.ts";
import type { YTMusic } from "../services/ytmusic.ts";
import type { YouTubeSearch } from "../services/youtube-search.ts";

export async function handleSearch(req: Request, searchParams: URLSearchParams, ytmusic: YTMusic, youtubeSearch: YouTubeSearch): Promise<Response> {
  const query = searchParams.get("q");
  const filter = searchParams.get("filter") || undefined;
  const continuationToken = searchParams.get("continuationToken") || undefined;
  const ignoreSpelling = searchParams.get("ignore_spelling") === "true";
  const withFallback = searchParams.get("fallback") !== "0";

  let region = searchParams.get("region") || searchParams.get("gl") || undefined;
  let language = searchParams.get("language") || searchParams.get("hl") || undefined;

  if (!region) {
    const detected = await detectRegionFromIP(req);
    if (detected) {
      region = detected.country;
      if (!language) language = detected.language;
    }
  }

  if (!query && !continuationToken) {
    return error("Please provide a search query or continuation token to perform a search.");
  }

  try {
    const results = await ytmusic.search(query || "", filter, continuationToken, ignoreSpelling, region, language);

    if (withFallback && filter === "songs" && results.results?.length > 0) {
      const enhanced = await Promise.all(
        results.results.slice(0, 10).map(async (song: any) => {
          try {
            const ytResults = await youtubeSearch.searchVideos(`${song.title} ${song.artists?.[0]?.name || ""} official`);
            const alt = ytResults.results?.find((v: any) => v.channel?.name && !v.channel.name.includes("Topic") && v.id);
            if (alt) return { ...song, fallbackVideoId: alt.id, fallbackTitle: alt.title };
          } catch {
            return song;
          }
        })
      );
      results.results = [...enhanced, ...results.results.slice(10)];
    }

    if (!results.results || results.results.length === 0) {
      return json({ query, filter, region, language, results: [], message: "No results found for your search query." });
    }

    return json({ query, filter, region, language, ...results });

  } catch (err) {
    return error("Unable to fetch search results. Please try again later.", 500);
  }
}

export async function handleSearchSuggestions(searchParams: URLSearchParams, ytmusic: YTMusic, youtubeSearch: YouTubeSearch): Promise<Response> {
  const query = searchParams.get("q");
  if (!query) {
    return error("Please provide a search query to get suggestions.");
  }

  if (query.length < 2) {
    return error("Search query must be at least 2 characters for suggestions.");
  }

  try {
    const music = searchParams.get("music");
    const suggestions = music === "1"
      ? await ytmusic.getSearchSuggestions(query)
      : await youtubeSearch.getSuggestions(query);

    if (!suggestions || suggestions.length === 0) {
      return json({ suggestions: [], source: music === "1" ? "youtube_music" : "youtube", message: "No suggestions found." });
    }

    return json({ suggestions, source: music === "1" ? "youtube_music" : "youtube" });

  } catch (err) {
    return error("Unable to fetch search suggestions. Please try again later.", 500);
  }
}

export async function handleYTSearch(searchParams: URLSearchParams, youtubeSearch: YouTubeSearch): Promise<Response> {
  const query = searchParams.get("q");
  const filter = searchParams.get("filter") || "all";
  const continuationToken = searchParams.get("continuationToken") || undefined;

  if (!query && !continuationToken) {
    return error("Please provide a search query or continuation token to perform a YouTube search.");
  }

  try {
    const results: unknown[] = [];
    let nextToken: string | null = null;

    if (continuationToken) {
      if (filter === "videos") {
        const r = await youtubeSearch.searchVideos(null, continuationToken);
        results.push(...r.results);
        nextToken = r.continuationToken;
      } else if (filter === "channels") {
        const r = await youtubeSearch.searchChannels(null, continuationToken);
        results.push(...r.results);
        nextToken = r.continuationToken;
      } else if (filter === "playlists") {
        const r = await youtubeSearch.searchPlaylists(null, continuationToken);
        results.push(...r.results);
        nextToken = r.continuationToken;
      }
    } else if (query) {
      if (filter === "videos" || filter === "all") {
        const r = await youtubeSearch.searchVideos(query);
        results.push(...r.results);
        nextToken = r.continuationToken;
      }
      if (filter === "channels" || filter === "all") {
        const r = await youtubeSearch.searchChannels(query);
        results.push(...r.results);
        if (!nextToken) nextToken = r.continuationToken;
      }
      if (filter === "playlists" || filter === "all") {
        const r = await youtubeSearch.searchPlaylists(query);
        results.push(...r.results);
        if (!nextToken) nextToken = r.continuationToken;
      }
    }

    if (results.length === 0) {
      return json({ filter, query, results: [], continuationToken: null, message: "No YouTube results found." });
    }

    return json({ filter, query, results, continuationToken: nextToken });

  } catch (err) {
    return error("Unable to fetch YouTube search results. Please try again later.", 500);
  }
      }
