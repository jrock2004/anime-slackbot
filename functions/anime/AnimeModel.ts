import type {
  Anime,
  AnimeTitle,
  ExternalLink,
  NextAiringEpisode,
} from './types';

export default class AnimeModel {
  readonly id: number;
  readonly bannerImage: string | null;
  readonly title: AnimeTitle;
  readonly status: string;
  readonly description: string;
  readonly nextAiringEpisode: NextAiringEpisode;
  readonly episodes: number;
  readonly genres: string[];
  readonly externalLinks: ExternalLink[];

  constructor(anime: Anime) {
    this.id = anime.id;
    this.bannerImage = anime.bannerImage;
    this.title = anime.title;
    this.status = anime.status;
    this.description = anime.description;
    this.nextAiringEpisode = anime.nextAiringEpisode ?? {};
    this.episodes = anime.episodes;
    this.genres = anime.genres;
    this.externalLinks = anime.externalLinks;
  }
}
