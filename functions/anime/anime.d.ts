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

export interface animeResponseType {
  data: {
    Media: {
      id: number;
      bannerImage: string;
      title: [key: string];
      status: string;
      description: string;
      nextAiringEpisode: string | null;
      episodes: number;
      genres: [string];
      externalLinks: [externalLinksType];
    };
  };
}
