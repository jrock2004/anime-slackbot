export type bodyParamsType = {
  text: string;
  response_url: string;
  token: string;
};

export type searchVariablesType = {
  anime: string;
};

type externalLinksType = {
  url: string;
  site: string;
};

type nextAiringEpisodeType = {
  timeUntilAiring?: number;
  episode?: number;
};

export type animeModelType = {
  id: number;
  bannerImage: string;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  status:
    | 'FINISHED'
    | 'RELEASING'
    | 'NOT_YET_RELEASED'
    | 'CANCELLED'
    | 'HIATUS';
  description: string;
  nextAiringEpisode: nextAiringEpisodeType;
  episodes: number;
  genres: string[];
  externalLinks: externalLinksType[];
};

export type animeResponseType = {
  data: {
    Media: animeModelType;
  };
};

export type ApiErrorResponse = {
  errors: Array<{ message: string }>;
};
