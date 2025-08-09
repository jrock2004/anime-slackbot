import { describe, expect, test, afterEach, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { searchApi, animeQuery } from './utils';

const mockAnimeResponse = {
  data: {
    Media: {
      id: 1535,
      title: { english: 'Death Note' },
      status: 'FINISHED',
      bannerImage: 'https://example.com/banner.jpg',
      description: 'A psychological thriller manga',
      episodes: 37,
      genres: ['Mystery', 'Psychological'],
      externalLinks: [],
    },
  },
};

const server = setupServer(
  http.post(
    'https://graphql.anilist.co',
    async ({ request }: { request: Request }) => {
      const body = (await request.json()) as {
        query: string;
        variables: { anime: string };
      };

      if (body.variables.anime === 'Death Note') {
        return HttpResponse.json(mockAnimeResponse);
      }

      if (body.variables.anime === 'NetworkError') {
        return HttpResponse.error();
      }

      if (body.variables.anime === 'ServerError') {
        return new HttpResponse(null, { status: 500 });
      }

      return HttpResponse.json({
        errors: [{ message: 'Anime not found' }],
      });
    }
  )
);

describe('searchApi', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  test('returns anime data on successful API call', async () => {
    const variables = { anime: 'Death Note' };
    const result = await searchApi(variables, animeQuery);

    expect(result).toEqual(mockAnimeResponse);
  });

  test('returns error response when API returns HTTP error', async () => {
    const variables = { anime: 'ServerError' };
    const result = await searchApi(variables, animeQuery);

    expect(result).toEqual({
      errors: [{ message: 'HTTP error! status: 500' }],
    });
  });

  test('returns error response when network request fails', async () => {
    const variables = { anime: 'NetworkError' };
    const result = await searchApi(variables, animeQuery);

    expect(result).toHaveProperty('errors');
    expect(
      (result as { errors: Array<{ message: string }> }).errors[0].message
    ).toContain('error');
  });

  test('handles GraphQL errors in response', async () => {
    const variables = { anime: 'UnknownAnime' };
    const result = await searchApi(variables, animeQuery);

    expect(result).toEqual({
      errors: [{ message: 'Anime not found' }],
    });
  });
});
