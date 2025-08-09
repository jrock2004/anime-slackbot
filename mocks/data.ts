import type { Anime } from '../functions/anime/types';
import type { AnimeApiResponse } from '../functions/anime/anime.d';

/**
 * Shared mock data for testing - keeps test data consistent across all test files
 */

export const mockAnimeData: Anime = {
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
    "Light Yagami is a genius high school student who is about to learn about life through a book of death. When a bored shinigami, a God of Death, named Ryuk drops a black notepad called a <i>Death Note</i>, Light receives power over life and death with the stroke of a pen. Determined to use this dark gift for the best, Light sets out to rid the world of evil… namely, the people he believes to be evil. Should anyone hold such power?<br>\n<br>\nThe consequences of Light's actions will set the world ablaze.<br>\n<br>\n(Source: Viz Media)",
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
    {
      url: 'http://www.ntv.co.jp/deathnote/',
      site: 'Official Site',
    },
  ],
};

export const mockAnimeResponse: AnimeApiResponse = {
  data: {
    Media: mockAnimeData,
  },
};

export const mockErrorResponse = {
  errors: [{ message: 'Anime not found' }],
};

export const mockAnimeWithoutNextEpisode: Anime = {
  ...mockAnimeData,
  nextAiringEpisode: undefined,
};

export const mockAnimeWithoutBanner: Anime = {
  ...mockAnimeData,
  bannerImage: null,
};

export const mockAnimeWithoutExternalLinks: Anime = {
  ...mockAnimeData,
  externalLinks: [],
};

export const mockAnimeWithMissingTitles: Anime = {
  ...mockAnimeData,
  title: {
    romaji: 'Death Note',
    english: undefined,
    native: undefined,
  },
};
