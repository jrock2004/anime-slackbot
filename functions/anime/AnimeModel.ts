import { animeModelType } from './anime.d';

export default class AnimeModel {
  public readonly id: number;
  public readonly bannerImage: string;
  public readonly title: { [key: string]: string };
  public readonly status: string;
  public readonly description: string;
  public readonly nextAiringEpisode: {
    timeUntilAiring?: number;
    episode?: number;
  };
  public readonly episodes: number;
  public readonly genres: string[];
  public readonly externalLinks: Array<{ url: string; site: string }>;

  constructor({
    id,
    bannerImage,
    title,
    status,
    description,
    nextAiringEpisode,
    episodes,
    genres,
    externalLinks,
  }: animeModelType) {
    this.id = id;
    this.bannerImage = bannerImage;
    this.title = title;
    this.status = status;
    this.description = description;
    this.nextAiringEpisode = nextAiringEpisode || {};
    this.episodes = episodes;
    this.genres = genres;
    this.externalLinks = externalLinks;
  }

  public getPreferredTitle(): string {
    return this.title.english || this.title.romaji || this.title.native;
  }

  public isFinished(): boolean {
    return this.status === 'FINISHED';
  }

  public hasNextEpisode(): boolean {
    return !this.isFinished() && !!this.nextAiringEpisode?.timeUntilAiring;
  }
}
