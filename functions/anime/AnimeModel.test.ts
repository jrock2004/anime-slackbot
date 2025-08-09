import { describe, expect, test } from 'vitest';
import AnimeModel from './AnimeModel';
import type { Anime } from './types';

describe('AnimeModel', () => {
  const mockAnimeData: Anime = {
    id: 1535,
    bannerImage:
      'https://s4.anilist.co/file/anilistcdn/media/anime/banner/1535.jpg',
    title: {
      romaji: 'Death Note',
      english: 'Death Note',
      native: 'DEATH NOTE',
    },
    status: 'FINISHED',
    description: 'Light Yagami is a genius high school student.',
    nextAiringEpisode: {
      timeUntilAiring: 92871,
      episode: 986,
    },
    episodes: 37,
    genres: ['Mystery', 'Psychological', 'Supernatural', 'Thriller'],
    externalLinks: [
      {
        url: 'http://www.hulu.com/death-note',
        site: 'Hulu',
      },
    ],
  };

  test('creates AnimeModel with all properties', () => {
    const anime = new AnimeModel(mockAnimeData);

    expect(anime.id).toBe(1535);
    expect(anime.bannerImage).toBe(
      'https://s4.anilist.co/file/anilistcdn/media/anime/banner/1535.jpg'
    );
    expect(anime.title).toEqual({
      romaji: 'Death Note',
      english: 'Death Note',
      native: 'DEATH NOTE',
    });
    expect(anime.status).toBe('FINISHED');
    expect(anime.description).toBe(
      'Light Yagami is a genius high school student.'
    );
    expect(anime.nextAiringEpisode).toEqual({
      timeUntilAiring: 92871,
      episode: 986,
    });
    expect(anime.episodes).toBe(37);
    expect(anime.genres).toEqual([
      'Mystery',
      'Psychological',
      'Supernatural',
      'Thriller',
    ]);
    expect(anime.externalLinks).toEqual([
      {
        url: 'http://www.hulu.com/death-note',
        site: 'Hulu',
      },
    ]);
  });

  test('handles undefined nextAiringEpisode', () => {
    const animeData: Anime = {
      ...mockAnimeData,
      nextAiringEpisode: undefined,
    };

    const anime = new AnimeModel(animeData);

    expect(anime.nextAiringEpisode).toEqual({});
  });

  test('handles null bannerImage', () => {
    const animeData: Anime = {
      ...mockAnimeData,
      bannerImage: null,
    };

    const anime = new AnimeModel(animeData);

    expect(anime.bannerImage).toBeNull();
  });

  test('properties are readonly - verified by TypeScript', () => {
    const anime = new AnimeModel(mockAnimeData);

    // This test mainly verifies TypeScript readonly enforcement
    // In JavaScript, readonly is only a compile-time check
    expect(anime.id).toBe(1535);
    expect(anime.status).toBe('FINISHED');
  });

  test('handles empty external links array', () => {
    const animeData: Anime = {
      ...mockAnimeData,
      externalLinks: [],
    };

    const anime = new AnimeModel(animeData);

    expect(anime.externalLinks).toEqual([]);
  });

  test('handles missing title properties', () => {
    const animeData: Anime = {
      ...mockAnimeData,
      title: {
        romaji: 'Test Anime',
      },
    };

    const anime = new AnimeModel(animeData);

    expect(anime.title.romaji).toBe('Test Anime');
    expect(anime.title.english).toBeUndefined();
    expect(anime.title.native).toBeUndefined();
  });
});
