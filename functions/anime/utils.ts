import fetch from 'node-fetch';

import { animeResponseType, searchVariablesType } from './anime.d';
import AnimeModel from './AnimeModel';
import {
  getBannerImage,
  getTitle,
  getDescription,
  getNextEpisode,
  getGenres,
  getExternalLinks,
  getSource,
} from './helpers';

export const searchApi = async (
  variables: searchVariablesType,
  query: string
): Promise<animeResponseType | { errors: Array<{ message: string }> }> => {
  try {
    const url = 'https://graphql.anilist.co';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as
      | animeResponseType
      | { errors: Array<{ message: string }> };
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return { errors: [{ message: errorMessage }] };
  }
};

export const getResponseText = (
  anime: AnimeModel,
  isMarkdown: boolean
): string => {
  let responseText = '';

  responseText += getBannerImage(anime, isMarkdown);
  responseText += getTitle(anime, isMarkdown);
  responseText += getDescription(anime);
  responseText += getNextEpisode(anime, isMarkdown);
  responseText += getGenres(anime, isMarkdown);
  responseText += getExternalLinks(anime, isMarkdown);
  responseText += getSource(isMarkdown);

  return responseText;
};

export const animeQuery = `
  query ($anime: String) {
    Media (search: $anime, type: ANIME) {
      id
      bannerImage
      title {
        romaji
        english
        native
      },
      status
      description
      nextAiringEpisode {
        timeUntilAiring
        episode
      }
      episodes
      genres
      externalLinks {
        url
        site
      }
    }
  }
`;
