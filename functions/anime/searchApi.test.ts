import { beforeEach, describe, expect, test, vi } from 'vitest';
import { searchApi, animeQuery } from './utils';
import type { Response } from 'node-fetch';

// Mock node-fetch
vi.mock('node-fetch');

import fetch from 'node-fetch';
const mockFetch = vi.mocked(fetch);

describe('searchApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns anime data on successful API call', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        data: {
          Media: {
            id: 1535,
            title: { english: 'Death Note' },
            status: 'FINISHED',
          },
        },
      }),
    } as unknown as Response;

    mockFetch.mockResolvedValue(mockResponse);

    const variables = { anime: 'Death Note' };
    const result = await searchApi(variables, animeQuery);

    expect(mockFetch).toHaveBeenCalledWith('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: animeQuery,
        variables: variables,
      }),
    });

    expect(result).toHaveProperty('data');
    if ('data' in result) {
      expect(result.data.Media.id).toBe(1535);
    }
  });

  test('returns error response when API returns HTTP error', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
    } as unknown as Response;

    mockFetch.mockResolvedValue(mockResponse);

    const variables = { anime: 'NonexistentAnime' };
    const result = await searchApi(variables, animeQuery);

    expect(result).toEqual({
      errors: [{ message: 'HTTP error! status: 404' }],
    });
  });

  test('returns error response when fetch throws an error', async () => {
    const errorMessage = 'Network error';
    mockFetch.mockRejectedValue(new Error(errorMessage));

    const variables = { anime: 'Death Note' };
    const result = await searchApi(variables, animeQuery);

    expect(result).toEqual({
      errors: [{ message: errorMessage }],
    });
  });

  test('returns error response when fetch throws unknown error', async () => {
    mockFetch.mockRejectedValue('Unknown error');

    const variables = { anime: 'Death Note' };
    const result = await searchApi(variables, animeQuery);

    expect(result).toEqual({
      errors: [{ message: 'Unknown error occurred' }],
    });
  });

  test('returns error response when response.json() fails', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockRejectedValue(new Error('JSON parse error')),
    } as unknown as Response;

    mockFetch.mockResolvedValue(mockResponse);

    const variables = { anime: 'Death Note' };
    const result = await searchApi(variables, animeQuery);

    expect(result).toEqual({
      errors: [{ message: 'JSON parse error' }],
    });
  });
});
