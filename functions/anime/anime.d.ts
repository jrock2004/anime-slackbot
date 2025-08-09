import type { Anime, SlackParams, SearchVariables } from './types';

export interface AnimeApiResponse {
  data: {
    Media: Anime;
  };
}

export interface ApiErrorResponse {
  errors: Array<{ message: string }>;
}

export type bodyParamsType = SlackParams;
export type searchVariablesType = SearchVariables;
export type animeModelType = Anime;
export type animeResponseType = AnimeApiResponse;
