export interface ExternalLink {
  url: string;
  site: string;
}

export interface NextAiringEpisode {
  timeUntilAiring?: number;
  episode?: number;
}

export interface AnimeTitle {
  romaji?: string;
  english?: string;
  native?: string;
}

export interface Anime {
  id: number;
  bannerImage: string | null;
  title: AnimeTitle;
  status: string;
  description: string;
  nextAiringEpisode?: NextAiringEpisode;
  episodes: number;
  genres: string[];
  externalLinks: ExternalLink[];
}

export interface SlackParams {
  text: string;
  response_url: string;
  token: string;
}

export interface SearchVariables {
  anime: string;
}
