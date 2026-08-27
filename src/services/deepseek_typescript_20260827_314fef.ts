import { parseSearchResults, parseSuggestions, parseMusicItem, parseTwoRowItem } from "./ytmusic-parser.ts";

interface SearchOptions {
  filter?: string;
  continuationToken?: string;
  ignoreSpelling?: boolean;
  region?: string;
  language?: string;
}

interface SongResult {
  videoId: string;
  title: string;
  author: string;
  lengthSeconds: number;
  thumbnail: string;
}

interface AlbumResult {
  browseId: string;
  title: string;
  artist: string;
  thumbnail: string;
  year: string;
  trackCount: number;
  tracks: any[];
}

interface ArtistResult {
  browseId: string;
  name: string;
  description: string;
  thumbnail: string;
  subscribers: string;
  topSongs: any[];
  albums: any[];
  singles: any[];
  videos: any[];
}

interface PlaylistResult {
  playlistId: string;
  title: string;
  author: string;
  description: string;
  thumbnail: string;
  trackCount: number;
  tracks: any[];
}

interface ArtistSummary {
  artistName: string;
  artistAvatar: string;
  playlistId: string | null;
  recommendedArtists: any[] | null;
}

interface TrackResult {
  videoId: string;
  title: string;
  author: string;
  thumbnail: string;
}

interface RelatedVideo {
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
}

interface ChartItem {
  title: string;
  items: any[];
}

type ChartsResult = ChartItem[];

export class YTMusic {
  private readonly baseURL = "https://music.youtube.com/youtubei/v1";
  private readonly apiKey = "AIzaSyC9XL3ZjWjXClIX1FmUxJq--EohcD4_oSs";
  private readonly context = {
    client: {
      hl: "en",
      gl: "US",
      clientName: "WEB_REMIX",
      clientVersion: "1.20251015.03.00",
      platform: "DESKTOP",
      utcOffsetMinutes: 0,
    },
  };

  private readonly filterMap: Record<string, string> = {
    songs: "EgWKAQIIAWoKEAkQAxAEEAoQBQ%3D%3D",
    videos: "EgWKAQIQAWoKEAkQAxAEEAoQBQ%3D%3D",
    albums: "EgWKAQIYAWoKEAkQAxAEEAoQBQ%3D%3D",
    artists: "EgWKAQIgAWoKEAkQAxAEEAoQBQ%3D%3D",
    playlists: "EgWKAQIoAWoKEAkQAxAEEAoQBQ%3D%3D",
    community_playlists: "EgeKAQQoAEABagoQAxAEEAkQChAF",
    featured_playlists: "EgeKAQQoADgBagoQAxAEEAkQChAF",
  };

  async search(query: string, options: SearchOptions = {}): Promise<any> {
    const { filter, continuationToken, ignoreSpelling = false, region, language } = options;
    const normalizedQuery = query.normalize("NFC");
    const filterParams = this.getFilterParams(filter);

    const params: any = continuationToken
      ? { continuation: continuationToken }
      : filterParams
        ? { query: normalizedQuery, params: filterParams }
        : { query: normalizedQuery };

    const context = this.buildContext(region, language);
    const data = await this.request("search", params, context);
    return parseSearchResults(data);
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    const data = await this.request("music/get_search_suggestions", { input: query.normalize("NFC") });
    return parseSuggestions(data);
  }

  async getSong(videoId: string): Promise<SongResult> {
    const data = await this.request("player", { videoId });
    const details = data?.videoDetails || {};
    return {
      videoId: details.videoId,
      title: details.title,
      author: details.author,
      lengthSeconds: details.lengthSeconds,
      thumbnail: details.thumbnail?.thumbnails?.[0]?.url,
    };
  }

  async getAlbum(browseId: string): Promise<AlbumResult> {
    const data = await this.request("browse", { browseId });
    const { title, artist, thumbnail, year } = this.extractAlbumHeader(data);
    const tracks = this.extractAlbumTracks(data);
    return { browseId, title, artist, thumbnail, year, trackCount: tracks.length, tracks };
  }

  async getArtist(browseId: string): Promise<ArtistResult> {
    const data = await this.request("browse", { browseId });
    const header = data?.header?.musicImmersiveHeaderRenderer || data?.header?.musicVisualHeaderRenderer || {};
    const contents = this.getSectionContents(data);

    const { topSongs, albums, singles, videos } = this.extractArtistContent(contents);

    return {
      browseId,
      name: header.title?.runs?.[0]?.text,
      description: header.description?.runs?.[0]?.text,
      thumbnail: header.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails?.slice(-1)[0]?.url,
      subscribers: header.subscriptionButton?.subscribeButtonRenderer?.subscriberCountText?.runs?.[0]?.text,
      topSongs,
      albums,
      singles,
      videos,
    };
  }

  async getArtistSummary(artistId: string, country = "US"): Promise<ArtistSummary> {
    const url = `${this.baseURL}/browse?key=${this.apiKey}`;
    const body = {
      browseId: artistId,
      context: { client: { ...this.context.client, gl: country } },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const header = data?.header?.musicImmersiveHeaderRenderer || data?.header?.musicVisualHeaderRenderer;
    const contents = this.getSectionContents(data);

    const playlistId = this.extractPlaylistId(contents);
    const recommendedArtists = this.extractRecommendedArtists(contents);

    return {
      artistName: header?.title?.runs?.[0]?.text,
      artistAvatar: header?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails?.[0]?.url,
      playlistId,
      recommendedArtists,
    };
  }

  async getPlaylist(playlistId: string): Promise<PlaylistResult> {
    const browseId = `VL${playlistId.replace(/^VL/, "")}`;
    const data = await this.request("browse", { browseId });

    const { title, author, description, thumbnail } = this.extractPlaylistHeader(data);
    const tracks = this.extractPlaylistTracks(data);

    return {
      playlistId: playlistId.replace(/^VL/, ""),
      title,
      author,
      description,
      thumbnail,
      trackCount: tracks.length,
      tracks,
    };
  }

  async getCharts(country?: string): Promise<ChartsResult> {
    const data = await this.request("browse", {
      browseId: "FEmusic_charts",
      formData: { selectedValues: [country || "US"] },
    });
    return this.parseChartsData(data);
  }

  async getMoodCategories(): Promise<ChartsResult> {
    const data = await this.request("browse", { browseId: "FEmusic_moods_and_genres" });
    return this.parseMoodsData(data);
  }

  async getMoodPlaylists(categoryId: string): Promise<any[]> {
    const data = await this.request("browse", { browseId: categoryId });
    const contents = this.getSectionContents(data);
    const playlists: any[] = [];

    for (const section of contents) {
      for (const item of (section.musicShelfRenderer?.contents || [])) {
        const parsed = parseMusicItem(item.musicResponsiveListItemRenderer);
        if (parsed) playlists.push(parsed);
      }
    }

    return playlists;
  }

  async getWatchPlaylist(
    videoId?: string,
    playlistId?: string,
    radio = false,
    shuffle = false,
    limit = 25
  ): Promise<{ tracks: TrackResult[] }> {
    const data = await this.request("next", { videoId, playlistId, radio, shuffle });
    const contents =
      data?.contents?.singleColumnMusicWatchNextResultsRenderer?.tabbedRenderer?.watchNextTabbedResultsRenderer
        ?.tabs?.[0]?.tabRenderer?.content?.musicQueueRenderer?.content?.playlistPanelRenderer?.contents || [];

    const tracks = contents
      .map((item: any) => {
        const video = item.playlistPanelVideoRenderer;
        if (!video) return null;
        return {
          videoId: video.videoId,
          title: video.title?.runs?.[0]?.text,
          author: video.shortBylineText?.runs?.[0]?.text,
          thumbnail: video.thumbnail?.thumbnails?.[0]?.url,
        };
      })
      .filter(Boolean);

    return { tracks: tracks.slice(0, limit) };
  }

  async getRelated(videoId: string): Promise<RelatedVideo[]> {
    const url = `https://www.youtube.com/youtubei/v1/next?key=${this.apiKey}`;
    const body = {
      videoId,
      context: { client: { clientName: "WEB", clientVersion: "2.20251013.01.00" } },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const secondaryResults =
      data?.contents?.twoColumnWatchNextResults?.secondaryResults?.secondaryResults?.results || [];

    const results: RelatedVideo[] = [];

    for (const item of secondaryResults) {
      const video = this.parseRelatedItem(item);
      if (video) results.push(video);
    }

    return results.slice(0, 20);
  }

  private async request(endpoint: string, params: any, context = this.context): Promise<any> {
    const url = `${this.baseURL}/${endpoint}?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context, ...params }),
    });
    return response.json();
  }

  private buildContext(region?: string, language?: string) {
    if (!region && !language) return this.context;
    return {
      client: {
        ...this.context.client,
        gl: region || this.context.client.gl,
        hl: language || this.context.client.hl,
      },
    };
  }

  private getFilterParams(filter?: string): string | undefined {
    if (!filter) return undefined;
    return this.filterMap[filter] || undefined;
  }

  private getSectionContents(data: any): any[] {
    return (
      data?.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer
        ?.contents ||
      data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer
        ?.contents ||
      []
    );
  }

  private extractAlbumHeader(data: any) {
    let title = "",
      artist = "",
      thumbnail = "",
      year = "";

    const oldHeader =
      data?.header?.musicDetailHeaderRenderer ||
      data?.header?.musicImmersiveHeaderRenderer ||
      data?.header?.musicVisualHeaderRenderer;

    if (oldHeader) {
      title = oldHeader.title?.runs?.[0]?.text;
      const subtitleRuns = oldHeader.subtitle?.runs || oldHeader.straplineTextOne?.runs || [];
      artist = subtitleRuns.find((r: any) => r.navigationEndpoint)?.text || subtitleRuns[0]?.text;
      thumbnail =
        oldHeader.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails?.slice(-1)[0]?.url ||
        oldHeader.thumbnail?.croppedSquareThumbnailRenderer?.thumbnail?.thumbnails?.slice(-1)[0]?.url;
    }

    const primaryContents = this.getSectionContents(data);
    for (const section of primaryContents) {
      if (section.musicResponsiveHeaderRenderer) {
        const h = section.musicResponsiveHeaderRenderer;
        title = h.title?.runs?.[0]?.text || title;
        const subtitleRuns = h.straplineTextOne?.runs || h.subtitle?.runs || [];
        artist = subtitleRuns.find((r: any) => r.navigationEndpoint)?.text || subtitleRuns[0]?.text || artist;
        thumbnail =
          h.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails?.slice(-1)[0]?.url || thumbnail;
        for (const run of h.subtitle?.runs || []) {
          const yearMatch = run.text?.match(/\d{4}/);
          if (yearMatch) year = yearMatch[0];
        }
      }
      if (section.musicDescriptionShelfRenderer) {
        const subHeader = section.musicDescriptionShelfRenderer.subheader?.runs?.[0]?.text || "";
        const yearMatch = subHeader.match(/\d{4}/);
        if (yearMatch && !year) year = yearMatch[0];
      }
    }

    return { title, artist, thumbnail, year };
  }

  private extractAlbumTracks(data: any): any[] {
    const tracks: any[] = [];
    const secondaryContents =
      data?.contents?.twoColumnBrowseResultsRenderer?.secondaryContents?.sectionListRenderer?.contents ||
      this.getSectionContents(data);

    for (const section of secondaryContents) {
      for (const item of section.musicShelfRenderer?.contents || []) {
        const parsed = parseMusicItem(item.musicResponsiveListItemRenderer);
        if (parsed) tracks.push(parsed);
      }
    }

    return tracks;
  }

  private extractArtistContent(contents: any[]) {
    const topSongs: any[] = [];
    const albums: any[] = [];
    const singles: any[] = [];
    const videos: any[] = [];

    for (const section of contents) {
      const shelf = section.musicShelfRenderer;
      const carousel = section.musicCarouselShelfRenderer;

      if (shelf) {
        const title = shelf.title?.runs?.[0]?.text?.toLowerCase() || "";
        if (title.includes("song")) {
          for (const item of shelf.contents || []) {
            const parsed = parseMusicItem(item.musicResponsiveListItemRenderer);
            if (parsed) topSongs.push(parsed);
          }
        }
      }

      if (carousel) {
        const title =
          carousel.header?.musicCarouselShelfBasicHeaderRenderer?.title?.runs?.[0]?.text?.toLowerCase() ||
          "";
        const items = (carousel.contents || [])
          .map((item: any) => parseTwoRowItem(item.musicTwoRowItemRenderer))
          .filter(Boolean);

        if (title.includes("album")) albums.push(...items);
        else if (title.includes("single")) singles.push(...items);
        else if (title.includes("video")) videos.push(...items);
      }
    }

    return { topSongs, albums, singles, videos };
  }

  private extractPlaylistId(contents: any[]): string | null {
    for (const item of contents) {
      const shelf = item.musicShelfRenderer;
      if (shelf?.title?.runs?.[0]?.text === "Top songs") {
        return (
          shelf.contents?.[0]?.musicResponsiveListItemRenderer?.flexColumns?.[0]
            ?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.navigationEndpoint
            ?.watchEndpoint?.playlistId || null
        );
      }
    }
    return null;
  }

  private extractRecommendedArtists(contents: any[]): any[] | null {
    for (const item of contents) {
      const carousel = item.musicCarouselShelfRenderer;
      const headerTitle =
        carousel?.header?.musicCarouselShelfBasicHeaderRenderer?.title?.runs?.[0]?.text;
      if (headerTitle === "Fans might also like") {
        return (carousel.contents || [])
          .map((it: any) => {
            const renderer = it.musicTwoRowItemRenderer;
            if (!renderer) return null;
            return {
              name: renderer.title?.runs?.[0]?.text,
              browseId: renderer.navigationEndpoint?.browseEndpoint?.browseId,
              thumbnail:
                renderer.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails?.[0]?.url,
            };
          })
          .filter(Boolean);
      }
    }
    return null;
  }

  private extractPlaylistHeader(data: any) {
    let title = "",
      author = "",
      description = "",
      thumbnail = "";

    const primaryContents = this.getSectionContents(data);

    for (const section of primaryContents) {
      if (section.musicResponsiveHeaderRenderer) {
        const h = section.musicResponsiveHeaderRenderer;
        title = h.title?.runs?.[0]?.text || "";
        const subtitleRuns = h.straplineTextOne?.runs || [];
        author = subtitleRuns.find((r: any) => r.navigationEndpoint)?.text || subtitleRuns[0]?.text || "";
        description =
          h.description?.musicDescriptionShelfRenderer?.description?.runs?.[0]?.text || "";
        thumbnail =
          h.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails?.slice(-1)[0]?.url || "";
      }
    }

    const oldHeader =
      data?.header?.musicDetailHeaderRenderer ||
      data?.header?.musicEditablePlaylistDetailHeaderRenderer?.header?.musicDetailHeaderRenderer;

    if (oldHeader && !title) {
      title = oldHeader.title?.runs?.[0]?.text || "";
      const subtitleRuns = oldHeader.subtitle?.runs || [];
      author = subtitleRuns.find((r: any) => r.navigationEndpoint)?.text || subtitleRuns[0]?.text || "";
      thumbnail =
        oldHeader.thumbnail?.croppedSquareThumbnailRenderer?.thumbnail?.thumbnails?.slice(-1)[0]?.url ||
        oldHeader.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails?.slice(-1)[0]?.url ||
        "";
    }

    return { title, author, description, thumbnail };
  }

  private extractPlaylistTracks(data: any): any[] {
    const tracks: any[] = [];
    const secondaryContents =
      data?.contents?.twoColumnBrowseResultsRenderer?.secondaryContents?.sectionListRenderer
        ?.contents || this.getSectionContents(data);

    for (const section of secondaryContents) {
      if (section.musicPlaylistShelfRenderer) {
        for (const item of section.musicPlaylistShelfRenderer.contents || []) {
          const parsed = parseMusicItem(item.musicResponsiveListItemRenderer);
          if (parsed) tracks.push(parsed);
        }
      }
      if (section.musicShelfRenderer) {
        for (const item of section.musicShelfRenderer.contents || []) {
          const parsed = parseMusicItem(item.musicResponsiveListItemRenderer);
          if (parsed) tracks.push(parsed);
        }
      }
    }

    return tracks;
  }

  private parseRelatedItem(item: any): RelatedVideo | null {
    if (item.lockupViewModel) {
      const lockup = item.lockupViewModel;
      const metadata = lockup.metadata?.lockupMetadataViewModel;
      const contentImage =
        lockup.contentImage?.collectionThumbnailViewModel?.primaryThumbnail?.thumbnailViewModel;
      const vid =
        lockup.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint?.videoId ||
        lockup.contentId;

      if (vid) {
        return {
          videoId: vid,
          title: metadata?.title?.content,
          artist: metadata?.metadata?.contentMetadataViewModel?.metadataRows?.[0]?.metadataParts?.[0]
            ?.text?.content,
          thumbnail: contentImage?.image?.sources?.[0]?.url,
          duration: metadata?.metadata?.contentMetadataViewModel?.metadataRows?.[0]?.metadataParts?.[2]
            ?.text?.content,
        };
      }
    }

    if (item.compactVideoRenderer) {
      const video = item.compactVideoRenderer;
      const durationText = video.lengthText?.simpleText || "";
      let durationSeconds = 0;
      if (durationText) {
        const parts = durationText.split(":").map((p: string) => parseInt(p) || 0);
        if (parts.length === 2) durationSeconds = parts[0] * 60 + parts[1];
        else if (parts.length === 3) durationSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      }

      if (video.videoId && !(durationSeconds > 0 && durationSeconds <= 60)) {
        return {
          videoId: video.videoId,
          title: video.title?.simpleText || video.title?.runs?.[0]?.text,
          artist: video.shortBylineText?.runs?.[0]?.text,
          thumbnail: video.thumbnail?.thumbnails?.[0]?.url,
          duration: durationText,
        };
      }
    }

    return null;
  }

  private parseChartsData(data: any): ChartsResult {
    const results: ChartsResult = [];
    const contents = this.getSectionContents(data);

    for (const section of contents) {
      if (section.musicCarouselShelfRenderer) {
        const title =
          section.musicCarouselShelfRenderer?.header?.musicCarouselShelfBasicHeaderRenderer?.title
            ?.runs?.[0]?.text;
        const items = (section.musicCarouselShelfRenderer?.contents || [])
          .map((item: any) =>
            parseTwoRowItem(item.musicTwoRowItemRenderer || item.musicResponsiveListItemRenderer)
          )
          .filter(Boolean);
        if (title && items.length) results.push({ title, items });
      }
      if (section.musicShelfRenderer) {
        const title = section.musicShelfRenderer?.title?.runs?.[0]?.text;
        const items = (section.musicShelfRenderer?.contents || [])
          .map((item: any) => parseMusicItem(item.musicResponsiveListItemRenderer))
          .filter(Boolean);
        if (title && items.length) results.push({ title, items });
      }
    }

    return results;
  }

  private parseMoodsData(data: any): ChartsResult {
    const results: ChartsResult = [];
    const contents = this.getSectionContents(data);

    for (const section of contents) {
      if (section.gridRenderer) {
        const items = (section.gridRenderer?.items || [])
          .map((item: any) => {
            const nav = item.musicNavigationButtonRenderer;
            if (!nav) return null;
            return {
              title: nav.buttonText?.runs?.[0]?.text,
              browseId: nav.clickCommand?.browseEndpoint?.browseId,
              color: nav.solid?.leftStripeColor,
            };
          })
          .filter(Boolean);
        if (items.length) results.push({ title: "Moods & Genres", items });
      }
      if (section.musicCarouselShelfRenderer) {
        const title =
          section.musicCarouselShelfRenderer?.header?.musicCarouselShelfBasicHeaderRenderer?.title
            ?.runs?.[0]?.text;
        const items = (section.musicCarouselShelfRenderer?.contents || [])
          .map((item: any) => {
            const nav = item.musicNavigationButtonRenderer;
            if (!nav) return null;
            return {
              title: nav.buttonText?.runs?.[0]?.text,
              browseId: nav.clickCommand?.browseEndpoint?.browseId,
              color: nav.solid?.leftStripeColor,
            };
          })
          .filter(Boolean);
        if (title && items.length) results.push({ title, items });
      }
    }

    return results;
  }
}