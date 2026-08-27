import { YTMusic } from "./ytmusic.ts";

interface SongCompleteResponse {
  success: boolean;
  error?: string;
  song?: {
    videoId: string;
    title: string;
    duration: number;
    thumbnail: string;
  };
  artist?: {
    name: string;
    browseId: string | null;
  };
  album?: {
    browseId: string;
  } | null;
}

interface AlbumCompleteResponse {
  success: boolean;
  error?: string;
  album?: {
    browseId: string;
    title: string;
    year: string;
    thumbnail: string;
    trackCount: number;
  };
  artist?: {
    name: string;
    browseId: string | null;
  };
  tracks?: Array<{
    videoId: string;
    title: string;
    duration: string;
    trackNumber: number;
  }>;
}

interface ArtistCompleteResponse {
  success: boolean;
  error?: string;
  artist?: {
    browseId: string;
    name: string;
    description: string;
    thumbnail: string;
    subscribers: string;
  };
  topSongs?: Array<{
    videoId: string;
    title: string;
    thumbnail: string;
  }>;
  albums?: Array<{
    browseId: string;
    title: string;
    year: string | null;
    thumbnail: string;
  }>;
  singles?: Array<{
    browseId: string;
    title: string;
    year: string | null;
    thumbnail: string;
  }>;
}

interface FullChainResponse {
  success: boolean;
  error?: string;
  song?: any;
  artist?: any;
  artistDetails?: {
    description: string;
    subscribers: string;
    thumbnail: string;
  };
  discography?: {
    albums: any[];
    singles: any[];
  };
  otherSongs?: any[];
}

export async function getSongComplete(videoId: string, ytmusic: YTMusic): Promise<SongCompleteResponse> {
  const song = await ytmusic.getSong(videoId);

  if (!song?.videoId) {
    return { success: false, error: "Song not found" };
  }

  const searchResults = await ytmusic.search(`${song.title} ${song.author}`, "songs");
  const match = searchResults.results?.find((r: any) => r.videoId === videoId);

  return {
    success: true,
    song: {
      videoId: song.videoId,
      title: song.title,
      duration: song.lengthSeconds,
      thumbnail: song.thumbnail,
    },
    artist: {
      name: song.author,
      browseId: match?.artists?.[0]?.id || null,
    },
    album: match?.browseId?.startsWith("MPRE") ? { browseId: match.browseId } : null,
  };
}

export async function getAlbumComplete(browseId: string, ytmusic: YTMusic): Promise<AlbumCompleteResponse> {
  const album = await ytmusic.getAlbum(browseId);

  if (!album?.title) {
    return { success: false, error: "Album not found" };
  }

  let artistBrowseId = null;

  if (album.artist) {
    const artistSearch = await ytmusic.search(album.artist, "artists");
    artistBrowseId = artistSearch.results?.[0]?.browseId || null;
  }

  return {
    success: true,
    album: {
      browseId: album.browseId,
      title: album.title,
      year: album.year,
      thumbnail: album.thumbnail,
      trackCount: album.trackCount,
    },
    artist: {
      name: album.artist,
      browseId: artistBrowseId,
    },
    tracks: album.tracks.map((t: any, i: number) => ({
      videoId: t.videoId,
      title: t.title,
      duration: t.duration,
      trackNumber: i + 1,
    })),
  };
}

export async function getArtistComplete(browseId: string, ytmusic: YTMusic): Promise<ArtistCompleteResponse> {
  const artist = await ytmusic.getArtist(browseId);

  if (!artist?.name) {
    return { success: false, error: "Artist not found" };
  }

  return {
    success: true,
    artist: {
      browseId: artist.browseId,
      name: artist.name,
      description: artist.description,
      thumbnail: artist.thumbnail,
      subscribers: artist.subscribers,
    },
    topSongs: artist.topSongs.map((s: any) => ({
      videoId: s.videoId,
      title: s.title,
      thumbnail: s.thumbnails?.[0]?.url,
    })),
    albums: artist.albums.map((a: any) => ({
      browseId: a.browseId,
      title: a.title,
      year: a.subtitle?.match(/\d{4}/)?.[0] || null,
      thumbnail: a.thumbnails?.[0]?.url,
    })),
    singles: artist.singles.map((s: any) => ({
      browseId: s.browseId,
      title: s.title,
      year: s.subtitle?.match(/\d{4}/)?.[0] || null,
      thumbnail: s.thumbnails?.[0]?.url,
    })),
  };
}

export async function getFullChain(videoId: string, ytmusic: YTMusic): Promise<FullChainResponse> {
  const songData = await getSongComplete(videoId, ytmusic);

  if (!songData.success) {
    return songData;
  }

  const result: FullChainResponse = {
    success: true,
    song: songData.song,
    artist: songData.artist,
  };

  if (songData.artist?.browseId) {
    const artistData = await getArtistComplete(songData.artist.browseId, ytmusic);

    if (artistData.success) {
      result.artistDetails = {
        description: artistData.artist?.description || "",
        subscribers: artistData.artist?.subscribers || "",
        thumbnail: artistData.artist?.thumbnail || "",
      };

      result.discography = {
        albums: artistData.albums || [],
        singles: artistData.singles || [],
      };

      result.otherSongs = (artistData.topSongs || [])
        .filter((s: any) => s.videoId !== videoId)
        .slice(0, 5);
    }
  }

  return result;
      }
