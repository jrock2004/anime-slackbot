import { describe, expect, test } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { searchApi, animeQuery } from './utils';

describe('searchApi', () => {
  test('returns anime data on successful API call', async () => {
    const variables = { anime: 'Death Note' };
    const result = await searchApi(variables, animeQuery);

    expect(result).toHaveProperty('data');
    if ('data' in result) {
      expect(result.data.Media.id).toBe(1535);
      expect(result.data.Media.title.english).toBe('Death Note');
      expect(result.data.Media.status).toBe('FINISHED');
    }
  });

  test('returns error response when API returns HTTP error', async () => {
    server.use(
      http.post('https://graphql.anilist.co', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const variables = { anime: 'ServerError' };
    const result = await searchApi(variables, animeQuery);

    expect(result).toEqual({
      errors: [{ message: 'HTTP error! status: 500' }],
    });
  });

  test('returns error response when network request fails', async () => {
    server.use(
      http.post('https://graphql.anilist.co', () => {
        return HttpResponse.error();
      })
    );

    const variables = { anime: 'NetworkError' };
    const result = await searchApi(variables, animeQuery);

    expect(result).toHaveProperty('errors');
    expect(
      (result as { errors: Array<{ message: string }> }).errors[0]
    ).toHaveProperty('message');
  });

  test('handles GraphQL errors in response', async () => {
    server.use(
      http.post('https://graphql.anilist.co', () => {
        return HttpResponse.json({
          errors: [{ message: 'Anime not found' }],
        });
      })
    );

    const variables = { anime: 'UnknownAnime' };
    const result = await searchApi(variables, animeQuery);

    expect(result).toEqual({
      errors: [{ message: 'Anime not found' }],
    });
  });

  test('handles response.json() parse errors', async () => {
    server.use(
      http.post('https://graphql.anilist.co', () => {
        return new HttpResponse('invalid json', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );

    const variables = { anime: 'BadJSON' };
    const result = await searchApi(variables, animeQuery);

    expect(result).toHaveProperty('errors');
    expect(
      (result as { errors: Array<{ message: string }> }).errors[0].message
    ).toContain('not valid JSON');
  });
});
