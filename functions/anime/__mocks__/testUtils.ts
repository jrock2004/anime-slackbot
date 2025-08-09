import { vi } from 'vitest';
import type { AnimeApiResponse } from '../anime.d';

export const mockAnimeResponse: AnimeApiResponse = {
  data: {
    Media: {
      id: 1535,
      bannerImage:
        'https://s4.anilist.co/file/anilistcdn/media/anime/banner/1535.jpg',
      title: {
        romaji: 'Death Note',
        english: 'Death Note',
        native: 'DEATH NOTE',
      },
      status: 'FINISHED',
      description:
        'Light Yagami is a genius high school student who discovers a supernatural notebook.',
      nextAiringEpisode: undefined,
      episodes: 37,
      genres: ['Mystery', 'Psychological', 'Supernatural', 'Thriller'],
      externalLinks: [
        {
          url: 'http://www.hulu.com/death-note',
          site: 'Hulu',
        },
      ],
    },
  },
};

export const mockAiringAnimeResponse: AnimeApiResponse = {
  data: {
    Media: {
      id: 21,
      bannerImage:
        'https://s4.anilist.co/file/anilistcdn/media/anime/banner/21.jpg',
      title: {
        romaji: 'One Piece',
        english: 'One Piece',
        native: 'ONE PIECE',
      },
      status: 'RELEASING',
      description: 'Gol D. Roger was known as the Pirate King.',
      nextAiringEpisode: {
        timeUntilAiring: 604800, // 1 week in seconds
        episode: 1000,
      },
      episodes: 0,
      genres: ['Action', 'Adventure', 'Comedy', 'Drama'],
      externalLinks: [],
    },
  },
};

export const mockErrorResponse = {
  errors: [{ message: 'Anime not found' }],
};

// Mock fetch globally
export const mockFetch = vi.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).fetch = mockFetch;
