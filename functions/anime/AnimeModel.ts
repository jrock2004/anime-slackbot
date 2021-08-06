import { animeModelType } from './anime.d';

export default class AnimeModel {
  id;
  bannerImage;
  title;
  status;
  description;
  nextAiringEpisode;
  episodes;
  genres;
  externalLinks;

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
    this.nextAiringEpisode = nextAiringEpisode;
    this.episodes = episodes;
    this.genres = genres;
    this.externalLinks = externalLinks;
  }
}
