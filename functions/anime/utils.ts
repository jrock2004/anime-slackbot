import fetch from 'node-fetch';

import type { Anime, SearchVariables } from './types';
import type { AnimeApiResponse } from './anime.d';
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
  variables: SearchVariables,
  query: string
): Promise<AnimeApiResponse | { errors: Array<{ message: string }> }> => {
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
      return {
        errors: [{ message: `HTTP error! status: ${response.status}` }],
      };
    }

    return (await response.json()) as AnimeApiResponse;
  } catch (error) {
    return {
      errors: [
        {
          message:
            error instanceof Error ? error.message : 'Unknown error occurred',
        },
      ],
    };
  }
};

export const getResponseText = (anime: Anime, isMarkdown: boolean): string => {
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
