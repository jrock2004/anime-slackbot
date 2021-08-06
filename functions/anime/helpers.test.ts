import moment from 'moment';

import {
  getBannerImage,
  getDescription,
  getExternalLinks,
  getGenres,
  getNextEpisode,
  getSource,
  getTitle,
} from './helpers';

const mockAnime = {
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
    'Light Yagami is a genius high school student who is about to learn about life through a book of death. When a bored shinigami, a God of Death, named Ryuk drops a black notepad called a <i>Death Note</i>, Light receives power over life and death with the stroke of a pen. Determined to use this dark gift for the best, Light sets out to rid the world of evil… namely, the people he believes to be evil. Should anyone hold such power?<br>\n<br>\nThe consequences of Light’s actions will set the world ablaze.<br>\n<br>\n(Source: Viz Media)',
  nextAiringEpisode: {},
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

test('banner image with markdown off will return slack syntax', () => {
  const results = getBannerImage(mockAnime, false);

  const testResult =
    'https://s4.anilist.co/file/anilistcdn/media/anime/banner/1535.jpg';

  expect(results.trim()).toStrictEqual(testResult.trim());
});

test('banner image with markdown on will return markdown syntax', () => {
  const results = getBannerImage(mockAnime, true);

  expect(results.trim()).toStrictEqual(
    '[Death Note](https://s4.anilist.co/file/anilistcdn/media/anime/banner/1535.jpg)'
  );
});

test('banner image with markdown on but no english title', () => {
  const mock = { ...mockAnime };

  mock.title = {
    english: '',
    romaji: 'hi',
    native: 'go',
  };

  const results = getBannerImage(mock, true);

  expect(results.trim()).toStrictEqual(
    '[hi](https://s4.anilist.co/file/anilistcdn/media/anime/banner/1535.jpg)'
  );
});

test('banner image with markdown on but no english or romaji title', () => {
  const mock = { ...mockAnime };

  mock.title = {
    english: '',
    romaji: '',
    native: 'go',
  };

  const results = getBannerImage(mock, true);

  expect(results.trim()).toStrictEqual(
    '[go](https://s4.anilist.co/file/anilistcdn/media/anime/banner/1535.jpg)'
  );
});

test('title with markdown off will return slack syntax', () => {
  const results = getTitle(mockAnime, false);

  expect(results.trim()).toStrictEqual('*Death Note* - FINISHED');
});

test('title with markdown on will return markdown syntax', () => {
  const results = getTitle(mockAnime, true);

  expect(results.trim()).toStrictEqual('# Death Note - FINISHED');
});

test('title with markdown on but no english title', () => {
  const mock = { ...mockAnime };

  mock.title = {
    english: '',
    romaji: 'hi',
    native: 'go',
  };

  const results = getTitle(mock, true);

  expect(results.trim()).toStrictEqual('# hi - FINISHED');
});

test('title with markdown on but no english or romaji title', () => {
  const mock = { ...mockAnime };

  mock.title = {
    english: '',
    romaji: '',
    native: 'go',
  };

  const results = getTitle(mock, true);

  expect(results.trim()).toStrictEqual('# go - FINISHED');
});

test('description strips our HTML markup', () => {
  const results = getDescription(mockAnime);
  const strippedDesc =
    '> Light Yagami is a genius high school student who is about to learn about life through a book of death. When a bored shinigami, a God of Death, named Ryuk drops a black notepad called a Death Note, Light receives power over life and death with the stroke of a pen. Determined to use this dark gift for the best, Light sets out to rid the world of evil… namely, the people he believes to be evil. Should anyone hold such power?  The consequences of Light’s actions will set the world ablaze.  (Source: Viz Media)';

  expect(results.trim()).toStrictEqual(strippedDesc);

  expect(results.trim()).not.toContain('<br>');
  expect(results.trim()).not.toContain('\\n');
});

test('finished anime with markdown off returns total ep count', () => {
  const results = getNextEpisode(mockAnime, false);

  expect(results.trim()).toStrictEqual('• *Total Episodes:* 37');
});

test('finished anime with markdown on returns total ep count', () => {
  const results = getNextEpisode(mockAnime, true);

  expect(results.trim()).toStrictEqual('* **Total Episodes:** 37');
});

test('not finished anime with markdown off returns when next ep will air', () => {
  const mock = { ...mockAnime };

  mock.status = 'RELEASING';
  mock.nextAiringEpisode = {
    timeUntilAiring: 92871,
    episode: 986,
  };

  const results = getNextEpisode(mock, false);
  const currentDate = moment(new Date());
  const nextEpisodeInSeconds = 92871;
  const duration = currentDate.add(nextEpisodeInSeconds, 'seconds');
  const nextEpisodeDate = `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m`;

  expect(results.trim()).toStrictEqual(
    `• *Next Episode:* 986 will air in ${nextEpisodeDate}`
  );
});

test('not finished anime with markdown on returns when next ep will air', () => {
  const mock = { ...mockAnime };

  mock.status = 'RELEASING';
  mock.nextAiringEpisode = {
    timeUntilAiring: 92871,
    episode: 986,
  };

  const results = getNextEpisode(mock, true);

  const currentDate = moment(new Date());
  const nextEpisodeInSeconds = 92871;
  const duration = currentDate.add(nextEpisodeInSeconds, 'seconds');
  const nextEpisodeDate = `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m`;

  expect(results.trim()).toStrictEqual(
    `* **Next Episode:** 986 will air in ${nextEpisodeDate}`
  );
});

test('genres with markdown off returns in slack syntax', () => {
  const results = getGenres(mockAnime, false);

  expect(results.trim()).toStrictEqual(
    '• *Genres:* Mystery, Psychological, Supernatural, Thriller'
  );
});

test('genres with markdown on returns in markdown syntax', () => {
  const results = getGenres(mockAnime, true);

  expect(results.trim()).toStrictEqual(
    '* *Genres:* Mystery, Psychological, Supernatural, Thriller'
  );
});

test('anime with external links and markdown off return in slack syntax', () => {
  const results = getExternalLinks(mockAnime, false);

  expect(results.trim()).toStrictEqual(
    '• *External Links:* Hulu, Official Site'
  );
});

test('anime with external links and markdown on return in slack syntax', () => {
  const results = getExternalLinks(mockAnime, true);

  expect(results.trim()).toStrictEqual(
    '* **External Links:** [Hulu](http://www.hulu.com/death-note), [Official Site](http://www.ntv.co.jp/deathnote/)'
  );
});

test('anime with no external links return an empty string', () => {
  const mock = { ...mockAnime };

  mock.externalLinks = [];

  const results = getExternalLinks(mock, false);

  expect(results).toEqual('');
});

test('get resources with markdown off returns in slack syntax', () => {
  const results = getSource(false);

  expect(results.trim()).toStrictEqual('• *Source:* Anilist');
});

test('get resources with markdown on returns in markdown syntax', () => {
  const results = getSource(true);

  expect(results.trim()).toStrictEqual(
    '* **Source:** [Anilist](https://anilist.co)'
  );
});
