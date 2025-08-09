import { http, HttpResponse } from 'msw';
import { mockAnimeResponse } from './data';

// Happy path handlers - define default successful API responses
export const handlers = [
  http.post('https://graphql.anilist.co', () => {
    return HttpResponse.json(mockAnimeResponse);
  }),
];
