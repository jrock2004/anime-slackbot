import fetch, { Response, FetchError } from 'node-fetch';

import { animeResponseType, searchVariablesType } from './anime.d';

export const searchApi = async (
  variables: searchVariablesType,
  query: string
): Promise<animeResponseType | FetchError> => {
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
