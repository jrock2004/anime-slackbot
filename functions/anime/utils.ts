import fetch, { Response, FetchError } from 'node-fetch';

import {
  animeModelType,
  animeResponseType,
  searchVariablesType,
} from './anime.d';
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
): Promise<animeResponseType | FetchError | string> => {
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

    return await fetch(url, options).then((res: Response) => res.json());
  } catch (error) {
    return error.message;
  }
};

export const getResponseText = (anime: animeModelType): string => {
  let responseText = '';
  const isMarkdown = false;

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
