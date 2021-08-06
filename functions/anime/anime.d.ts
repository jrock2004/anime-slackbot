export interface bodyParamsType {
  text: string;
  response_url: string;
  token: string;
}

export interface searchVariablesType {
  anime: string;
}

interface externalLinksType {
  url: string;
  site: string;
}

interface nextAiringEpisodeType {
  timeUntilAiring?: number;
  episode?: number;
}

export interface animeModelType {
  id: number;
  bannerImage: string;
  title: { [key: string]: string };
  status: string;
  description: string;
  nextAiringEpisode: nextAiringEpisodeType | null;
  episodes: number;
  genres: [string];
  externalLinks: [externalLinksType];
}

export interface animeResponseType {
  data: {
    Media: animeModelType;
  };
}
