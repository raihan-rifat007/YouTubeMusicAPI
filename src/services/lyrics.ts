interface LyricsResult {
  success: boolean;
  trackName?: string;
  artistName?: string;
  albumName?: string;
  duration?: number;
  plainLyrics?: string;
  syncedLyrics?: string;
  error?: string;
}

interface LrcLibResponse {
  trackName?: string;
  artistName?: string;
  albumName?: string;
  duration?: number;
  plainLyrics?: string;
  syncedLyrics?: string;
  statusCode?: number;
}

export async function getLyrics(title: string, artist: string, duration?: number): Promise<LyricsResult> {
  try {
    const exactMatch = await fetchExactMatch(title, artist, duration);

    if (exactMatch && !exactMatch.statusCode) {
      return formatSuccess(exactMatch);
    }

    const searchResult = await fetchSearchFallback(title, artist);

    if (searchResult) {
      return formatSuccess(searchResult);
    }

    return { success: false, error: "Lyrics not found for the specified track." };

  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch lyrics. Please try again later.",
    };
  }
}

async function fetchExactMatch(title: string, artist: string, duration?: number): Promise<LrcLibResponse | null> {
  let url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(artist)}`;

  if (duration) {
    url += `&duration=${duration}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.statusCode !== 404) {
      return data;
    }

    return null;
  } catch {
    return null;
  }
}

async function fetchSearchFallback(title: string, artist: string): Promise<LrcLibResponse | null> {
  const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${title} ${artist}`)}`;

  try {
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }

    return null;
  } catch {
    return null;
  }
}

function formatSuccess(data: LrcLibResponse): LyricsResult {
  return {
    success: true,
    trackName: data.trackName,
    artistName: data.artistName,
    albumName: data.albumName,
    duration: data.duration,
    plainLyrics: data.plainLyrics,
    syncedLyrics: data.syncedLyrics,
  };
        }
