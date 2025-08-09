import moment from 'moment';
import { stripHtml } from 'string-strip-html';

import type { Anime } from './types';

export const getBannerImage = (anime: Anime, isMarkdown?: boolean): string => {
  const title = anime.title.english || anime.title.romaji || anime.title.native;

  if (!anime.bannerImage) {
    return '';
  }

  if (isMarkdown) {
    return `[${title}](${anime.bannerImage})\n\n`;
  } else {
    return `${anime.bannerImage}\n\n`;
  }
};

export const getTitle = (anime: Anime, isMarkdown?: boolean): string => {
  const title = anime.title.english || anime.title.romaji || anime.title.native;
  if (isMarkdown) {
    return `# ${title} - ${anime.status}\n`;
  } else {
    return `*${title}* - ${anime.status}\n\n`;
  }
};

export const getDescription = (anime: Anime): string => {
  return `> ${stripHtml(anime.description).result.replace(/\n/g, ' ')}\n\n`;
};

export const getNextEpisode = (anime: Anime, isMarkdown?: boolean): string => {
  if (
    anime.status !== 'FINISHED' &&
    anime.nextAiringEpisode?.timeUntilAiring !== undefined &&
    anime.nextAiringEpisode?.timeUntilAiring !== null
  ) {
    const nextEpisodeInSeconds = anime.nextAiringEpisode.timeUntilAiring;
    const nextEpisode = anime.nextAiringEpisode.episode;

    const duration = moment.duration(nextEpisodeInSeconds, 'seconds');
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const nextEpisodeDate = `${days}d ${hours}h ${minutes}m`;

    if (isMarkdown) {
      return `* **Next Episode:** ${nextEpisode} will air in ${nextEpisodeDate}\n`;
    } else {
      return `• *Next Episode:* ${nextEpisode} will air in ${nextEpisodeDate}\n`;
    }
  } else {
    if (isMarkdown) {
      return `* **Total Episodes:** ${anime.episodes}\n`;
    } else {
      return `• *Total Episodes:* ${anime.episodes}\n`;
    }
  }
};

export const getGenres = (anime: Anime, isMarkdown?: boolean): string => {
  const genres = anime.genres.join(', ');

  if (isMarkdown) {
    return `* *Genres:* ${genres}\n`;
  } else {
    return `• *Genres:* ${genres}\n`;
  }
};

export const getExternalLinks = (
  anime: Anime,
  isMarkdown?: boolean
): string => {
  if (anime.externalLinks.length === 0) {
    return '';
  }

  const links = anime.externalLinks
    .map((link) => {
      if (isMarkdown) {
        return `[${link.site}](${link.url})`;
      } else {
        return `<${link.url}|${link.site}>`;
      }
    })
    .join(', ');

  if (isMarkdown) {
    return `* **External Links:** ${links}\n`;
  } else {
    return `• *External Links:* ${links}\n`;
  }
};

export const getSource = (isMarkdown?: boolean): string => {
  if (isMarkdown) {
    return '* **Source:** [Anilist](https://anilist.co) \n\n';
  } else {
    return '• *Source:* Anilist\n\n';
  }
};
